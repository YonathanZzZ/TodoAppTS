import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

interface NewDisplayAlertProps {
    message: string;
    onClose: () => void;
}

const NewDisplayAlert = ({ message, onClose }: NewDisplayAlertProps) => {
    if(!message){
        return null;
    }

    return (
        <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error" onClose={onClose}>
                {message}
            </Alert>
        </Stack>
    );
};

export default NewDisplayAlert;