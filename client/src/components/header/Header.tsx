import {AppBar, PaletteMode, Toolbar, Typography} from "@mui/material";
import {ThemeToggle} from "./ThemeToggle.tsx";
import {AccountMenu} from "./AccountMenu.tsx";
import {Dispatch, SetStateAction} from "react";
import {deleteUserFromDB} from "../../sendRequestToServer.ts";
import Cookies from "js-cookie";
import {userActions} from "../../redux/userSlice.tsx";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

interface HeaderProps{
    setAlertMessage: Dispatch<SetStateAction<string>>
    mode: PaletteMode;
    setMode: Dispatch<SetStateAction<PaletteMode>>;
}

const Header = ({setAlertMessage, mode, setMode}: HeaderProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deleteAccount = async () => {
        try {
            await deleteUserFromDB();
            logOut();
        } catch (error) {
            setAlertMessage("Failed to delete account");
        }
    };

    const logOut = () => {
        Cookies.remove("token");
        dispatch(userActions.logout());
        navigate('/login');
    };

    return(
        <AppBar position="sticky">
            <Toolbar>
                <ThemeToggle mode={mode} setMode={setMode}/>
                <Typography
                    variant="h5"
                    sx={{flexGrow: 1, textAlign: "center"}}
                >
                    ToDo List
                </Typography>
                <AccountMenu
                    logout={logOut}
                    deleteAccount={deleteAccount}
                />
            </Toolbar>
        </AppBar>
    )
}

export default Header;