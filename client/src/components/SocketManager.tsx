import io, { Socket } from 'socket.io-client';
import * as TodosStateFunctions from './TodosStateFunctions';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Dispatch, SetStateAction } from 'react';
import {TodoData} from '../interfaces/todo-item.interface';
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

interface EventData {
    addTask: {id: string, taskData: TodoData};
    removeTask: {id: string};
    editTask: {id: string, newContent: string};
    changeTaskDone: {id: string, done: boolean};
}

const initSocket = (email: string, serverURL: string, setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>) => {
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

        TodosStateFunctions.addTodo(setTodos, taskID, taskData);
    };

    const onTaskRemoved = (data: {id: string}) => {
        TodosStateFunctions.deleteTodo(setTodos, data.id);
    };

    const onTaskEdited = (data: {id: string, newContent: string}) => {
        const taskID = data.id;
        const newContent = data.newContent;

        TodosStateFunctions.editTodo(setTodos, taskID, newContent);
    };

    const onChangeTaskDone = (data: {id: string, done: boolean}) => {
        const taskID = data.id;
        const newDoneValue = data.done;

        TodosStateFunctions.toggleDone(setTodos, taskID, newDoneValue);
    };

    socket.on("addTask", onTaskAdded);
    socket.on("deleteTask", onTaskRemoved);
    socket.on("editTask", onTaskEdited);
    socket.on("toggleDone", onChangeTaskDone);

    socket.connect();
}

const emitAddTask = (data: EventData["addTask"]) => {
    if(!socket){
        return;
    }

    socket.emit("addTask", data);
}

const emitRemoveTask = (data: EventData["removeTask"]) => {
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

    socket.emit("toggleDone", data);
}

export {initSocket, emitAddTask, emitRemoveTask, emitEditTask, emitToggleDone};