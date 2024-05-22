import "../App.css";
import {useEffect, useState} from "react";
import {PaletteMode, ThemeProvider,} from "@mui/material";
import {LoginPage} from "./login/LoginPage.tsx";
import Cookies from "js-cookie";
import {getMUITheme} from "../theme.ts";
import {jwtDecode} from 'jwt-decode';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import MainPage from "./MainPage.tsx";
import Layout from "./Layout.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store.tsx";
import {userActions} from "../redux/userSlice.tsx";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mode, setMode] = useState<PaletteMode>("light");
    const theme = getMUITheme(mode);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            setMode(mediaQuery.matches ? "dark" : "light");
        };

        const userSetting = localStorage.getItem("mode");
        if (userSetting === 'light' || userSetting === 'dark') {
            setMode(userSetting);
        } else {
            handleChange();
        }

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    interface Token{
        email: string;
    }

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            return;
        }

        const decodedToken = jwtDecode<Token>(token);
        dispatch(userActions.login({email: decodedToken.email}))
        navigate('/');
    }, []);

    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    return (
        <ThemeProvider theme={theme}>
            <Layout>
                <Routes>
                    <Route path="/" element={isLoggedIn ? <MainPage mode={mode} setMode={setMode}/> : <Navigate to="/login"/>}/>
                    <Route path="/login" element={<LoginPage />}/>
                </Routes>
            </Layout>
        </ThemeProvider>
        
    );
}

export default App;
