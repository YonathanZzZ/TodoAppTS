import { Box } from "@mui/material"
import { default as TodoTabs } from "./TodoTabs"
import TodoList from "./TodoList"
import { useState } from "react";

interface TodoContainerProps {
    todos: Map<string, any>; //TODO type of value in Map???
    remove: () => void;
    edit: (taskID: string, editedText: string) => void;
    toggleDone: () => void;
}

const TodoContainer = ({todos, remove, edit, toggleDone}: TodoContainerProps) => {
    const TODO_TAB = 0;

    const [tabIndex, setTabIndex] = useState(TODO_TAB);

    function getTasksByDoneValue(done: boolean) {
        return new Map([...todos].filter(([_, taskData]) => taskData.done === done));
    }

    return(
        <Box>
            <TodoTabs tabIndex={tabIndex} setTabIndex={setTabIndex}/>
            {tabIndex === TODO_TAB ? (
                <TodoList todos={getTasksByDoneValue(false)} remove={remove} edit={edit} toggleDone={toggleDone} isDone={false}/>
            ) : (
                <TodoList todos={getTasksByDoneValue(true)} remove={remove} edit={edit} toggleDone={toggleDone} isDone={true}/>
            )}
        </Box>
    )
}

export default TodoContainer;