import io, { Socket } from 'socket.io-client';
import * as TodosStateFunctions from './TodosStateFunctions.ts';
import {TodoData} from '../../shared/interfaces/todo-item.interface.ts';
import {SocketEvents} from "../../shared/interfaces/socket-io.interface.ts";
let socket: Socket<SocketEvents, SocketEvents> | null = null;

interface EventData {
    addTask: {id: string, taskData: TodoData};
    deleteTask: string;
    editTask: {id: string, newContent: string};
    changeTaskDone: {id: string, done: boolean};
}

const initSocket = (email: string, serverURL: string) => {
    if(socket){
        //socket already initialized
        return;
    }

    socket = io(serverURL, {
        autoConnect: false,
        query: {
            email: email
        },
    });

    const onTaskAdded = (newTask: {id: string, taskData: TodoData}) => {
        const taskID = newTask.id;
        const taskData = newTask.taskData;

        TodosStateFunctions.addTodoToState(taskID, taskData);
    };

    const onTaskRemoved = (taskID: string) => {
        TodosStateFunctions.deleteTodoFromState(taskID);
    };

    const onTaskEdited = (data: {id: string, newContent: string}) => {
        const taskID = data.id;
        const newContent = data.newContent;

        TodosStateFunctions.editTodoInState(taskID, newContent);
    };

    const onChangeTaskDone = (data: {id: string, done: boolean}) => {
        const taskID = data.id;
        const newDoneValue = data.done;

        TodosStateFunctions.toggleDoneInState(taskID, newDoneValue);
    };

    socket.on("addTask", onTaskAdded);
    socket.on("deleteTask", onTaskRemoved);
    socket.on("editTask", onTaskEdited);
    socket.on("changeTaskDone", onChangeTaskDone);

    socket.connect();
}

const emitAddTask = (data: EventData["addTask"]) => {
    if(!socket){
        return;
    }

    socket.emit("addTask", data);
}

const emitRemoveTask = (data: EventData["deleteTask"]) => {
    if(!socket){
        return;
    }

    socket.emit("deleteTask", data);
}

const emitEditTask = (data: EventData["editTask"]) => {
    if (!socket) {
        return;
    }

    socket.emit("editTask", data);
}

const emitToggleDone = (data: EventData["changeTaskDone"]) => {
    if (!socket) {
        return;
    }

    socket.emit("changeTaskDone", data);
}

export {initSocket, emitAddTask, emitRemoveTask, emitEditTask, emitToggleDone};