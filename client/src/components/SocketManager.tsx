import io, { Socket } from 'socket.io-client';
import * as TodosStateFunctions from './TodosStateFunctions';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Dispatch, SetStateAction } from 'react';
import {TodoData} from '../interfaces/todo-item.interface';
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
//TODO type of value of Map user to store tasks???
const initSocket = (email: string, serverURL: string, setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>) => {
    if(socket){
        return;
    }

    socket = io(serverURL, {
        autoConnect: false,
        query: {
            email: email
        },
    });

    const onTaskAdded = (newTask) => {

        const taskID = newTask.id;
        const taskData = newTask.taskData;

        TodosStateFunctions.addTodo(setTodos, taskID, taskData);
    };

    const onTaskRemoved = (taskID: string) => {
        TodosStateFunctions.deleteTodo(setTodos, taskID);
    };

    const onTaskEdited = (data) => {
        const taskID = data.id;
        const newContent = data.newContent;

        TodosStateFunctions.editTodo(setTodos, taskID, newContent);
    };

    const onToggleDone = (data) => {
        const taskID = data.id;
        const newDoneValue = data.done;

        TodosStateFunctions.toggleDone(setTodos, taskID, newDoneValue);
    };

    socket.on("addTask", onTaskAdded);
    socket.on("deleteTask", onTaskRemoved);
    socket.on("editTask", onTaskEdited);
    socket.on("toggleDone", onToggleDone);

    socket.connect();
}

const sendEvent = (event, data) => {
    socket.emit(event, data);
}

export {initSocket, sendEvent};