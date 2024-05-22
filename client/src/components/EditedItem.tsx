import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {MutableRefObject} from "react";

interface EditedItemProps {
    taskID: string
    editedText: MutableRefObject<string>
    saveEditing: (taskID: string) => void
    cancelEditing: () => void
}

export const EditedItem = ({taskID, editedText, saveEditing, cancelEditing}: EditedItemProps) => {
    return (
        <>
            <TextField
                autoFocus={true}
                variant="filled"
                fullWidth={true}
                onChange={(e) => editedText.current = e.target.value}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        saveEditing(taskID);
                    } else if (e.key === 'Escape') {
                        cancelEditing();
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
        </>
    )
}