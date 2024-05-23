import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";

interface LoginButtonProps {
    text: string,
    isLoading: boolean,
    disabled: boolean,
    handleClick: () => void
}

declare module "@mui/material" {
    interface CircularProgressPropsColorOverrides {
        background: true;
    }
}

const LoginButton = ({text, isLoading, disabled, handleClick}: LoginButtonProps) => {
    return (
        <Button variant="contained" onClick={handleClick} disabled={disabled}>
            {isLoading ? <CircularProgress color="background"/> : text}
        </Button>
    )
}

export default LoginButton;