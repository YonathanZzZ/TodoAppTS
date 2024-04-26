import "../App.css";
import {useEffect, useState} from "react";
import TodoInput from "./TodoInput";
import DisplayAlert from "./DisplayAlert";
import {AppBar, Box, Container, PaletteMode, Paper, ThemeProvider, Toolbar, Typography,} from "@mui/material";
import {
    addTaskToDB,
    deleteTaskFromDB,
    deleteUserFromDB,
    editTaskOnDB,
    getTasksFromDB,
    setAuthErrorHandler
} from "./sendRequestToServer";
import {LoginPage} from "./LoginPage";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {AccountMenu} from "./AccountMenu";
import {v4 as uuidv4} from "uuid";
import {ThemeToggle} from "./ThemeToggle";
import TodoContainer from "./TodoContainer";
import {emitAddTask, emitEditTask, emitRemoveTask, emitToggleDone, initSocket} from './SocketManager';
import * as TodosStateFunctions from "./TodosStateFunctions";
import {Todo, TodoData} from "../../../shared/todo-item.interface.ts";
import { getMUITheme } from "./theme";

function App() {
    const [todos, setTodos] = useState(new Map<string, TodoData>());
    const [alertMessage, setAlertMessage] = useState("");
    const [email, setEmail] = useState("");
    const serverURL = import.meta.env.DEV
        ? "http://localhost:8080"
        : window.location.origin;
    const [mode, setMode] = useState<PaletteMode>("light");

    const theme = getMUITheme(mode); 

    useEffect(() => {
        setAuthErrorHandler(
            () => {
                //execute when token authentication fails (no token or expired token)
                setEmail("");
            }
        );
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            setMode(mediaQuery.matches ? "dark" : "light");
        };

        const userSetting = localStorage.getItem("mode");
        if (userSetting === 'light' || userSetting === 'dark') {
            setMode(userSetting);
        }else{
            handleChange();
        }
        
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    interface Token{
        email: string;
    }

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            return;
        }

        const decodedToken = jwtDecode<Token>(token);
        const emailFromToken = decodedToken.email;

        setEmail(emailFromToken);

    }, []);

    const tasksArrayToMap = (tasks: Todo[]) => {
        const resultMap = new Map();
        tasks.forEach(task => {
            const {id, ...rest} = task;
            resultMap.set(id, rest);
        });
        return resultMap;
    }

    useEffect(() => {
        if (!email) {
            return;
        }

        getTasksFromDB(email)
            .then((tasks) => {
                const tasksMap = tasksArrayToMap(tasks);
                setTodos(tasksMap);
            })
            .catch((error) => {
                setAlertMessage(error.message);
            });
    }, [email]); //run when user logs in

    useEffect(() => {
        if (!email) {
            return;
        }

        initSocket(email, serverURL, setTodos);
    }, [email]);

    const closeAlert = () => {
        setAlertMessage("");
    };

    const addTodoToState = (taskID: string, taskData: TodoData) => {
        TodosStateFunctions.addTodo(setTodos, taskID, taskData);
    };

    const deleteTodoFromState = (taskID: string) => {
        TodosStateFunctions.deleteTodo(setTodos, taskID);

    };

    const editTodoOnState = (taskID: string, updatedContent: string) => {
        TodosStateFunctions.editTodo(setTodos, taskID, updatedContent);

    };

    const toggleDoneOnState = (taskID: string) => {
        TodosStateFunctions.toggleDone(setTodos, taskID);
    };

    const addTodo = async (todo: string) => {
        if (todo === "") {
            return;
        }

        const taskID = uuidv4();
        const newTodoData = {content: todo, done: false};
        addTodoToState(taskID, newTodoData);

        const newTodo = {...newTodoData, id: taskID};

        try{
            await addTaskToDB(newTodo);
            const {id, ...taskData} = newTodo;
            emitAddTask({id, taskData});
        }catch(error){
            console.error("Error adding task to db: ", error);
            setAlertMessage("Failed to upload new task to server");

            //delete task that failed to upload to database
            deleteTodoFromState(taskID);
        }
    };

    const deleteTodo = async (taskID: string) => {
        const todoDataBackup = todos.get(taskID);
        if(!todoDataBackup) {
            //task doesn't exist
            return;
        }
        deleteTodoFromState(taskID);

        try{
            await deleteTaskFromDB(taskID);
            emitRemoveTask(taskID);
        }catch (error) {
            setAlertMessage("Failed to delete task on server");

            //restore task
            addTodoToState(taskID, todoDataBackup);
        }
    };

    const editContent = async (taskID: string, updatedContent: string) => {
        const contentBackup = todos.get(taskID)?.content;
        if(!contentBackup) {
            return;
        }

        editTodoOnState(taskID, updatedContent);

        try{
            await editTaskOnDB(taskID, {content: updatedContent});
            emitEditTask({id: taskID,
                newContent: updatedContent});
        }catch(error){
            setAlertMessage("Failed to update task on server");

            //restore previous content of task
            editTodoOnState(taskID, contentBackup);
        }
    };

    const toggleDone = async (taskID: string) => {
        const task = todos.get(taskID);
        if(!task){
            return;
        }

        const doneValue = task.done;

        toggleDoneOnState(taskID);

        try{
            await editTaskOnDB(taskID, {done: !doneValue});
            emitToggleDone({id: taskID, done: !doneValue});
        }catch(error){
            setAlertMessage("Failed to update task on server");

            //restore old done value
            toggleDoneOnState(taskID);
        }
    };

    const logOut = () => {
        Cookies.remove("token");
        setEmail("");
    };

    const deleteAccount = async () => {
        try{
            await deleteUserFromDB();
            logOut();
        }catch(error){
            setAlertMessage("Failed to delete account");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{
                height: "100vh",
                padding: 0,
                backgroundColor: theme.palette.background.default,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Paper elevation={5} sx={{width: "100%", maxWidth: "sm", height: "100vh", overflow: "auto"}}>
                    {email ? (
                        <>
                            <AppBar position="sticky">
                                <Toolbar>
                                    <ThemeToggle mode={mode} setMode={setMode}/>
                                    <Typography
                                        variant="h5"
                                        sx={{flexGrow: 1, textAlign: "center"}}
                                    >
                                        ToDo List
                                    </Typography>
                                    <AccountMenu
                                        logout={logOut}
                                        deleteAccount={deleteAccount}
                                    />
                                </Toolbar>

                                <Box
                                    style={{
                                        background: theme.palette.background.default,
                                        padding: "6px",
                                    }}
                                >
                                    <TodoInput addTodo={addTodo}/>

                                    {alertMessage && (
                                        <DisplayAlert
                                            message={alertMessage}
                                            onClose={closeAlert}
                                        />
                                    )}
                                </Box>
                            </AppBar>
                            <TodoContainer
                                todos={todos}
                                remove={deleteTodo}
                                edit={editContent}
                                toggleDone={toggleDone}
                            />
                        </>
                    ) : (
                        <>
                            <LoginPage setEmail={setEmail}/>
                        </>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default App;
