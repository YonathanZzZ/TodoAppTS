import {Box} from "@mui/material"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import TodoInput from "./TodoInput.tsx";
import {v4 as uuidv4} from "uuid";
import {
    addTaskToDB,

} from "../sendRequestToServer.ts";
import {emitAddTask, initSocket} from "../SocketManager.ts";
import {
    initSetTodosFunc,
    addTodoToState,
    deleteTodoFromState
} from "../TodosStateFunctions.ts";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.tsx";
import ListContainer from "./ListContainer.tsx";
import {TodoData} from "@shared/interfaces/todo-item.interface.ts";

interface TodoContainerProps {
    setAlertMessage: Dispatch<SetStateAction<string>>;
}

const TodoContainer = ({setAlertMessage}: TodoContainerProps) => {
    const [todos, setTodos] = useState(new Map<string, TodoData>());

    const email = useSelector((state: RootState) => state.user.email);

    initSetTodosFunc(setTodos);

    useEffect(() => {
        const serverURL = import.meta.env.VITE_SERVER_URL;

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

    return (
        <Box sx={{height: '90%'}}>
            <TodoInput addTodo={addTodo}/>
            <ListContainer setAlertMessage={setAlertMessage} todos={todos} setTodos={setTodos}/>
        </Box>
    )
}

export default TodoContainer;