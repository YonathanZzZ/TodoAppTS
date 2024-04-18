import {ListItemText, useTheme} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from '@mui/icons-material/Done';
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";

interface TodoItemProps {
    id: string
    content: string
    remove: (id: string) => void
    startEditing: (id: string, content: string) => void
    toggleDone: (id: string) => void
    isDone: boolean
}

export const TodoItem = ({id, content, remove, startEditing, toggleDone, isDone}: TodoItemProps) => {
    const theme = useTheme();
    return (
        <>
            <IconButton
                edge="start"
                size="small"
                color="primary"
                onClick={() => {
                    toggleDone(id);
                }}
            >
                {isDone ? <RemoveDoneIcon/> : <DoneIcon/>}
            </IconButton>

            <ListItemText
                primary={content}
                primaryTypographyProps={{
                    component: 'div',
                    style: {
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                    },
                    color: theme.palette.text.primary,
                }}
            />

            <IconButton
                edge="end"
                size="small"
                color="primary"
                onClick={() => {
                    startEditing(id, content);
                }}
            >
                <EditIcon/>
            </IconButton>

            <IconButton
                edge="end"
                size="small"
                color="delete"
                onClick={() => {
                    remove(id);
                }}
            >
                <DeleteIcon/>
            </IconButton>
        </>
    )
}