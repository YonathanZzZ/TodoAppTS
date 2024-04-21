import {TodoData} from "../interfaces/todo-item.interface.ts";
import {Dispatch, SetStateAction} from "react";

export const addTodo = (setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>, taskID: string, taskData: TodoData) => {

    setTodos(prevTodos => new Map([...prevTodos, [taskID, taskData]]));
};

export const deleteTodo = (setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>, taskID: string) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        newTodos.delete(taskID);
        return newTodos;
    });
};

export const editTodo = (setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>, taskID: string, updatedContent: string) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        const updatedTodo = newTodos.get(taskID);
        if(!updatedTodo){
            //task does not exist
            return prevTodos;
        }

        updatedTodo.content = updatedContent;
        newTodos.set(taskID, updatedTodo);
        return newTodos;
    });
};

export const toggleDone = (setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>, taskID: string, newDoneValue?: boolean) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        const newTodo = newTodos.get(taskID);
        if(!newTodo){
            //task does not exist
            return prevTodos;
        }

        newTodo.done = newDoneValue ? newDoneValue : !newTodo.done;
        newTodos.set(taskID, newTodo);
        return newTodos;
    });
};