export const addTodo = (setTodos, taskID: string, taskData) => {
    setTodos(prevTodos => new Map([...prevTodos, [taskID, taskData]]));
};

export const deleteTodo = (setTodos, taskID: string) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        newTodos.delete(taskID);
        return newTodos;
    });
};

export const editTodo = (setTodos, taskID: string, updatedContent: string) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        const updatedTodo = newTodos.get(taskID);
        updatedTodo.content = updatedContent;
        newTodos.set(taskID, updatedTodo);
        return newTodos;
    });
};

export const toggleDone = (setTodos, taskID: string, newDoneValue?: boolean) => {
    setTodos(prevTodos => {
        const newTodos = new Map(prevTodos);
        const newTodo = newTodos.get(taskID);
        newTodo.done = newDoneValue ? newDoneValue : !newTodo.done;
        newTodos.set(taskID, newTodo);
        return newTodos;
    });
};