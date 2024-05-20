import {TodoData} from "./todo-item.interface";

export interface SocketEvents { //used as both client-to-server and server-to-client events
    addTask: (task: {id: string, taskData: TodoData}) => void;
    deleteTask: (taskID: string) => void;
    editTask: (data: {id: string, newContent: string}) => void;
    changeTaskDone: (data: {id: string, done: boolean}) => void;
}