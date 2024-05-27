import React, {useState} from 'react';
import {List, ListItem} from '@mui/material';
import Divider from '@mui/material/Divider';
import {EditedItem} from "./EditedItem";
import {TodoItem} from "./TodoItem";
import {TodoData} from "@shared/interfaces/todo-item.interface.ts";

interface TodoListProps {
    todos: Map<string, TodoData>;
    remove: (taskID: string) => void;
    edit: (taskID: string, updatedContent: string) => void;
    toggleDone: (taskID: string) => void;
    isDone: boolean;
}

const TodoList = ({todos, remove, edit, toggleDone, isDone}: TodoListProps) => {
    const [editingTaskID, setEditingTaskID] = useState("");

    const startEditing = (taskID: string, _text: string) => {
        setEditingTaskID(taskID);
    };

    const cancelEditing = () => {
        setEditingTaskID("");
    };

    const saveEditing = (taskID: string, newContent: string) => {
        if (newContent.trim() === '') {
            return;
        }

        edit(taskID, newContent);
        cancelEditing();
    };

    return (
        <List>
            {[...todos].map(([taskID, taskData], index) => (
                <React.Fragment key={taskID}>
                    <ListItem>
                        {editingTaskID === taskID ? (
                            <EditedItem
                                taskID={taskID}
                                textBeforeEdit={taskData.content}
                                saveEditing={saveEditing}
                                cancelEditing={cancelEditing}
                            />
                        ) : (
                            <TodoItem
                                id={taskID}
                                content={taskData.content}
                                remove={remove}
                                startEditing={startEditing}
                                toggleDone={toggleDone}
                                isDone={isDone}
                            />
                        )}
                    </ListItem>
                    {/* add divider to list items except the last one */}
                    {index !== todos.size - 1 && <Divider component="li"/>}
                </React.Fragment>
            ))}
        </List>
    );
};

export default TodoList;
