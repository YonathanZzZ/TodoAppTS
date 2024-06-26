import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from "@mui/material/IconButton";
import {Dispatch, SetStateAction} from "react";
import {PaletteMode} from "@mui/material";

interface ThemeToggleProps {
    mode: PaletteMode;
    setMode: Dispatch<SetStateAction<PaletteMode>>;
}

export const ThemeToggle = ({mode, setMode}: ThemeToggleProps) => {
    const handleToggle = () => {
        let newMode: PaletteMode;
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