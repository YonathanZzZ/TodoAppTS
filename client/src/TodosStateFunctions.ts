import {TodoData} from "../../shared/interfaces/todo-item.interface.ts";
import {Dispatch, SetStateAction} from "react";

let setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>;

export const initSetTodosFunc = (setTodosFunc: Dispatch<SetStateAction<Map<string, TodoData>>>) => {
    setTodos = setTodosFunc;
}

export const addTodoToState = (taskID: string, taskData: TodoData) => {
    setTodos(prevTodos => new Map([...prevTodos, [taskID, taskData]]));
};

export const deleteTodoFromState = (taskID: string) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        newTodos.delete(taskID);
        return newTodos;
    });
};

export const editTodoInState = (taskID: string, updatedContent: string) => {
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

export const toggleDoneInState = (taskID: string, newDoneValue?: boolean) => {
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