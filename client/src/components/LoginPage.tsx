import Stack from "@mui/material/Stack";
import {Box, TextField} from "@mui/material";
import React, {useState} from "react";
import Button from "@mui/material/Button";
import {addUser, getAccessToken} from "../sendRequestToServer.ts";
import Cookies from 'js-cookie';
import isEmail from 'validator/lib/isEmail';
import DisplayAlert from "./shared/DisplayAlert.tsx";
import axios, {AxiosError} from "axios";
import {useDispatch} from "react-redux";
import {userActions} from "../redux/userSlice.tsx";
import {useNavigate} from "react-router-dom";



export const LoginPage = () => {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [inputErrors, setInputErrors] = useState({email: "", password: ""});
    const [alertMessage, setAlertMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isPasswordValid = (password: string) => {
        const hasMinLength = password.length >= 8;
        const hasDigit = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasCapitalLetter = /[A-Z]/.test(password);

        return hasMinLength && hasDigit && hasLetter && hasCapitalLetter;
    }

    const areRegisterFieldsValid = () => {
        let isValid = true;

        if (!isEmail(emailInput)) {
            setInputErrors(prevErrors => ({
                ...prevErrors,
                email: "Invalid email address"
            }));

            isValid = false;
        }

        if (!isPasswordValid(passwordInput)) {
            setInputErrors(prevErrors => ({
                ...prevErrors,
                password: "Password must be at least 8 characters long and contain at least 1 digit and 1 lowercase and uppercase letters",
            }));

            isValid = false;
        }

        return isValid;
    }

    const resetErrors = () => {
        setInputErrors({email: "", password: ""});
    }

    interface StatusCodeMessages {
        [key: number]: string;
    }

    const statusCodeMessages: StatusCodeMessages = {
        400: "Invalid email address or weak password",
        401: "Invalid credentials",
        409: "An account with this email address already exists",
        500: "Internal server error",
    };

    const extractStatusCode = (error: Error | AxiosError) => {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.status;
        }

        return null;
    }

    const getAlertMessage = (error: any) => {
        let resMessage: string;
        const statusCode = extractStatusCode(error);
        if (!statusCode) {
            resMessage = "Unknown error while trying to log-in";
        } else {
            const message = statusCodeMessages[statusCode];
            if (!message) {
                resMessage = "Unknown error while trying to log-in";
            } else {
                resMessage = message;
            }
        }
        return resMessage;
    }

    const loginUser = async () => {
        try {
            const token = await getAccessToken(emailInput, passwordInput);

            Cookies.set('token', token, {
                sameSite: 'strict',
                secure: true
            });

            dispatch(userActions.login({email: emailInput}));
            navigate('/');

        } catch (error) {
            setAlertMessage(getAlertMessage(error));
        }
    }

    const areLoginFieldsValid = () => {
        let valid = true;

        if (!passwordInput) {
            setInputErrors(prevErrors => ({
                ...prevErrors,
                password: "Password cannot be empty",
            }));

            valid = false;
        }

        if (!emailInput) {
            setInputErrors(prevErrors => ({
                ...prevErrors,
                email: "Email cannot be empty",
            }));

            valid = false;
        } else if (!isEmail(emailInput)) {
            setInputErrors(prevErrors => ({
                ...prevErrors,
                email: "Invalid email",
            }));

            valid = false;
        }

        return valid;
    }

    const handleLoginButton = async () => {
        resetErrors();

        if (!areLoginFieldsValid()) {
            return;
        }

        await loginUser();
    };

    const handleRegisterButton = async () => {
        resetErrors();

        if (!areRegisterFieldsValid()) {
            return;
        }

        try {
            await addUser(emailInput, passwordInput);
            await loginUser();
        } catch (error: any) {
            setAlertMessage(getAlertMessage(error));
        }
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code !== "Enter") {
            return;
        }

        try {
            await handleLoginButton();
        } catch (error) {
            console.error("Failed to login user: ", error);
        }
    };



    return (
        <Stack direction="column" spacing={1}>
            <Box textAlign="center">
                <h1>Please Login or Register</h1>
            </Box>
            {alertMessage && (
                <DisplayAlert
                    message={alertMessage}
                    onClose={() => setAlertMessage("")}
                />
            )}
            <TextField
                id="email-field"
                autoFocus={true}
                variant="filled"
                label="Enter email"
                fullWidth={true}
                required={true}
                type="email"
                error={Boolean(inputErrors.email)}
                helperText={inputErrors.email}
                onChange={(e) => {
                    setEmailInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
            />

            <TextField
                id="password-field"
                variant="filled"
                label="Enter password"
                fullWidth={true}
                required={true}
                type="password"
                error={Boolean(inputErrors.password)}
                helperText={inputErrors.password}
                onChange={(e) => {
                    setPasswordInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
            />
            <Box style={{margin: '5px'}}>
                <Stack direction="row" justifyContent="space-between">
                    <Button variant="contained" onClick={handleLoginButton}>Login</Button>
                    <Button variant="contained" onClick={handleRegisterButton}>Register</Button>
                </Stack>
            </Box>
        </Stack>
    );
}