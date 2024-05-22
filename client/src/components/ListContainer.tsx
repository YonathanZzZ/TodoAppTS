import TodoTabs from "./TodoTabs.tsx";
import TodoList from "./TodoList.tsx";
import Loading from "./Loading.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {deleteTaskFromDB, editTaskOnDB, getTasksFromDB} from "../sendRequestToServer.ts";
import {addTodoToState, deleteTodoFromState, editTodoInState, toggleDoneInState} from "../TodosStateFunctions.ts";
import {emitEditTask, emitRemoveTask, emitToggleDone} from "../SocketManager.ts";
import {Todo, TodoData} from "../../../shared/interfaces/todo-item.interface.ts";

interface ListContainerProps{
    setAlertMessage: Dispatch<SetStateAction<string>>
    todos: Map<string, TodoData>
    setTodos: Dispatch<SetStateAction<Map<string, TodoData>>>
}

const ListContainer = ({setAlertMessage, todos, setTodos}: ListContainerProps) => {
    const TODO_TAB = 0;
    const [tabIndex, setTabIndex] = useState(TODO_TAB);
    const [isLoading, setIsLoading] = useState(true);

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

    const getTasksByDoneValue = (done: boolean) => {
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

    return(
        <>
            <TodoTabs tabIndex={tabIndex} setTabIndex={setTabIndex}/>

            {isLoading ? (<Loading/>) : (
                tabIndex === TODO_TAB ? (
                    <TodoList todos={getTasksByDoneValue(false)} remove={deleteTodo} edit={editContent}
                              toggleDone={toggleDone} isDone={false}/>
                ) : (
                    <TodoList todos={getTasksByDoneValue(true)} remove={deleteTodo} edit={editContent}
                              toggleDone={toggleDone} isDone={true}/>
                )
            )}
        </>
    )
}

export default ListContainer;