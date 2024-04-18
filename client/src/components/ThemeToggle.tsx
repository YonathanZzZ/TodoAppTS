import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from "@mui/material/IconButton";
import {Dispatch, SetStateAction} from "react";

interface ThemeToggleProps {
    mode: string;
    setMode: Dispatch<SetStateAction<string>>;
}

export const ThemeToggle = ({mode, setMode}: ThemeToggleProps) => {
    const handleToggle = () => {
        let newMode;
        if(mode === 'light'){
            newMode = 'dark';
        }else{
            newMode = 'light';
        }

        setMode(newMode);
        localStorage.setItem('mode', newMode);
    }

    return(
        <IconButton
            edge="start"
            size="small"
            onClick={() => {
                handleToggle()
            }}
        >
            {mode === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}
        </IconButton>
    )
}