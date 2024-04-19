import React, {useState} from "react";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";

interface TodoInputProps {
    addTodo: (todo: string) => void;
}

const TodoInput = ({addTodo}: TodoInputProps) => {

    const [input, setInput] = useState("");

    const handleClick = () => {
        addTodo(input);
        setInput("");

    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleClick();
        }
    }

    return (
        <div className="input-wrapper">

            <TextField
                id="todo-field"
                autoFocus={true}
                variant="filled"
                label="Enter task"
                value={input}
                fullWidth={true}
                onChange={(e) => {
                    setInput(e.target.value);
                }}

                onKeyDown={handleKeyDown}
            />

            <Button size="small" variant="contained" onClick={handleClick}>Add Task</Button>

        </div>
    );
};

export default TodoInput;