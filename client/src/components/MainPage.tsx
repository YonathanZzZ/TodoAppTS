import TodoContainer from "./TodoContainer.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import Header from "./header/Header.tsx";
import DisplayAlert from "./shared/DisplayAlert.tsx";
import {setAuthErrorHandler} from "../sendRequestToServer.ts";
import {useDispatch} from "react-redux";
import {userActions} from "../redux/userSlice.tsx";
import {PaletteMode} from "@mui/material";

interface MainPageProps{
    mode: PaletteMode;
    setMode: Dispatch<SetStateAction<PaletteMode>>;
}

const MainPage = ({mode, setMode}: MainPageProps) => {
    const [alertMessage, setAlertMessage] = useState("");
    const dispatch = useDispatch();

    const closeAlert = () => {
        setAlertMessage("");
    };

    useEffect(() => {
        setAuthErrorHandler(
            () => {
                //log user out if token authentication fails
                dispatch(userActions.logout());
            }
        );
    }, []);

    return(
        <>
            <Header setAlertMessage={setAlertMessage} mode={mode} setMode={setMode} />

            {alertMessage && (
                <DisplayAlert
                    message={alertMessage}
                    onClose={closeAlert}
                />
            )}
            
            <TodoContainer  setAlertMessage={setAlertMessage}/>
        </>
    )
}

export default MainPage;