import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

interface DisplayAlertProps {
    message: string;
    onClose: () => void;
}

const DisplayAlert = ({ message, onClose }: DisplayAlertProps) => {
    return (
        <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error" onClose={onClose}>
                {message}
            </Alert>
        </Stack>
    );
};

export default DisplayAlert;