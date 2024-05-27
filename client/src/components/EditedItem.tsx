import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {useState} from "react";
import DoneIcon from "@mui/icons-material/Done";

interface EditedItemProps {
    taskID: string
    textBeforeEdit: string
    saveEditing: (taskID: string, newContent: string) => void
    cancelEditing: () => void
}

export const EditedItem = ({taskID, textBeforeEdit,saveEditing, cancelEditing}: EditedItemProps) => {
    const [editedText, setEditedText] = useState(textBeforeEdit);

    return (
        <>
            <TextField
                autoFocus={true}
                variant="filled"
                fullWidth={true}
                onChange={(e) => setEditedText(e.target.value)}
                value={editedText}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        saveEditing(taskID, editedText);
                    }
                }}
            />

            <IconButton
                edge="end"
                size="small"
                color="secondary"
                onClick={() => cancelEditing()}
            >
                <CloseIcon/>
            </IconButton>

            <IconButton
                edge="end"
                size="small"
                color="secondary"
                onClick={() => saveEditing(taskID, editedText)}
            >
                <DoneIcon/>
            </IconButton>
        </>
    )
}