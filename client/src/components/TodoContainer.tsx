import {Box} from "@mui/material"
import {default as TodoTabs} from "./TodoTabs"
import TodoList from "./TodoList"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import TodoInput from "./TodoInput.tsx";
import {v4 as uuidv4} from "uuid";
import {
    addTaskToDB,
    deleteTaskFromDB,
    editTaskOnDB,
    getTasksFromDB,
} from "./sendRequestToServer.tsx";
import {emitAddTask, emitEditTask, emitRemoveTask, emitToggleDone, initSocket} from "./SocketManager.tsx";
import {Todo, TodoData} from "../../../shared/todo-item.interface.ts";
import {
    initSetTodosFunc,
    addTodoToState,
    editTodoInState,
    toggleDoneInState,
    deleteTodoFromState
} from "./TodosStateFunctions.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.tsx";
import LinearLoading from "./LinearLoading.tsx";

interface TodoContainerProps {
    setAlertMessage: Dispatch<SetStateAction<string>>;
}

const TodoContainer = ({setAlertMessage}: TodoContainerProps) => {
    const TODO_TAB = 0;

    const [tabIndex, setTabIndex] = useState(TODO_TAB);
    const [todos, setTodos] = useState(new Map<string, TodoData>());
    const email = useSelector((state: RootState) => state.user.email);
    const [isLoading, setIsLoading] = useState(true);

    initSetTodosFunc(setTodos);

    useEffect(() => {
        const serverURL = import.meta.env.DEV
            ? "http://localhost:8080"
            : window.location.origin;

        initSocket(email, serverURL);
    }, []);


    const addTodo = async (todo: string) => {
        if (todo === "") {
            return;
        }

        const taskID = uuidv4();
        const newTodoData = {content: todo, done: false};
        addTodoToState(taskID, newTodoData);

        const newTodo = {...newTodoData, id: taskID};

        try {
            await addTaskToDB(newTodo);
            const {id, ...taskData} = newTodo;
            emitAddTask({id, taskData});
        } catch (error) {
            console.error("Error adding task to db: ", error);
            setAlertMessage("Failed to upload new task to server");
            deleteTodoFromState(taskID);
        }
    };

    const deleteTodo = async (taskID: string) => {
        const todoDataBackup = todos.get(taskID);
        if (!todoDataBackup) {
            return;
        }

        deleteTodoFromState(taskID);

        try {
            await deleteTaskFromDB(taskID);
            emitRemoveTask(taskID);
        } catch (error) {
            setAlertMessage("Failed to delete task on server");
            addTodoToState(taskID, todoDataBackup);
        }
    };

    const editContent = async (taskID: string, updatedContent: string) => {
        const contentBackup = todos.get(taskID)?.content;
        if (!contentBackup) {
            return;
        }

        editTodoInState(taskID, updatedContent);

        try {
            await editTaskOnDB(taskID, {content: updatedContent});
            emitEditTask({id: taskID, newContent: updatedContent});
        } catch (error) {
            setAlertMessage("Failed to update task on server");
            editTodoInState(taskID, contentBackup);
        }
    };

    const toggleDone = async (taskID: string) => {
        const task = todos.get(taskID);
        if (!task) {
            return;
        }

        const doneValue = task.done;

        toggleDoneInState(taskID);

        try {
            await editTaskOnDB(taskID, {done: !doneValue});
            emitToggleDone({id: taskID, done: !doneValue});
        } catch (error) {
            setAlertMessage("Failed to update task on server");
            toggleDoneInState(taskID);
        }
    };

    function getTasksByDoneValue(done: boolean) {
        return new Map([...todos].filter(([_, taskData]) => taskData.done === done));
    }

    const tasksArrayToMap = (tasks: Todo[]) => {
        const resultMap = new Map();
        tasks.forEach(task => {
            const {id, ...rest} = task;
            resultMap.set(id, rest);
        });
        return resultMap;
    }

    useEffect(() => {
        getTasksFromDB()
            .then((tasks) => {
                const tasksMap = tasksArrayToMap(tasks);
                setTodos(tasksMap);
            })
            .catch((error) => {
                setAlertMessage(error.message);
            }).finally(() => {
                setIsLoading(false);
        });
    }, []);

    return (
        <Box sx={{height: '90%'}}>
            <TodoInput addTodo={addTodo}/>
            <TodoTabs tabIndex={tabIndex} setTabIndex={setTabIndex}/>

            {isLoading ? (<LinearLoading/>) : (
                tabIndex === TODO_TAB ? (
                    <TodoList todos={getTasksByDoneValue(false)} remove={deleteTodo} edit={editContent}
                              toggleDone={toggleDone} isDone={false}/>
                ) : (
                    <TodoList todos={getTasksByDoneValue(true)} remove={deleteTodo} edit={editContent}
                              toggleDone={toggleDone} isDone={true}/>
                )
            )}
        </Box>
    )
}

export default TodoContainer;