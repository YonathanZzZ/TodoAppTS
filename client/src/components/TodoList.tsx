import React, {useState} from 'react';
import {List, ListItem} from '@mui/material';
import Divider from '@mui/material/Divider';
import {EditedItem} from "./EditedItem";
import {TodoItem} from "./TodoItem";
import {TodoData} from "../../../shared/todo-item.interface.ts";

interface TodoListProps{
    todos: Map<string, TodoData>;
    remove: (taskID: string) => void;
    edit: (taskID: string, updatedContent: string) => void;
    toggleDone: (taskID: string) => void;
    isDone: boolean;
}

const TodoList = ({todos, remove, edit, toggleDone, isDone}: TodoListProps) => {
    const [editingTaskID, setEditingTaskID] = useState("");
    const [editedText, setEditedText] = useState('');

    const startEditing = (taskID: string, text: string) => {
        setEditingTaskID(taskID);
        setEditedText(text);
    };

    const cancelEditing = () => {
        setEditingTaskID("");
        setEditedText('');
    };

    const saveEditing = (taskID: string) => {
        if (editedText.trim() !== '') {
            edit(taskID, editedText);
            cancelEditing();
        }
    };

    return (
        <List>
            {[...todos].map(([taskID, taskData], index) => (
                <React.Fragment key={taskID}>
                    <ListItem>
                        {editingTaskID === taskID ? (
                            <EditedItem
                                taskID={taskID}
                                editedText={editedText}
                                setEditedText={setEditedText}
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
                     {index !== todos.size - 1 && <Divider component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default TodoList;
