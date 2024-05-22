import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";

interface LoginButtonProps {
    text: string,
    isLoading: boolean,
    handleClick: () => void
}

declare module "@mui/material" {
    interface CircularProgressPropsColorOverrides {
        background: true;
    }
}

const LoginButton = ({text, isLoading, handleClick}: LoginButtonProps) => {
    return (
        <Button variant="contained" onClick={handleClick}>
            {isLoading ? <CircularProgress color="background"/> : text}
        </Button>
    )
}

export default LoginButton;