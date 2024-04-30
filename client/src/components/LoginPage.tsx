import Stack from "@mui/material/Stack";
import {Box, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useState} from "react";
import Button from "@mui/material/Button";
import {addUser, getAccessToken} from "./sendRequestToServer";
import Cookies from 'js-cookie';
import isEmail from 'validator/lib/isEmail';
import DisplayAlert from "./DisplayAlert.tsx";

interface LoginPageProps {
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

export const LoginPage = ({setIsLoggedIn}: LoginPageProps) => {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [inputErrors, setInputErrors] = useState({email: "", password: ""});
    const [alertMessage, setAlertMessage] = useState("");

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

        if(!isPasswordValid(passwordInput)){
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

    const loginUser = async () => {
        try{
            const token = await getAccessToken(emailInput, passwordInput);
            if (!token) {
                throw new Error("Failed to get token from server");
            }

            Cookies.set('token', token, {
                sameSite: 'strict',
                secure: true
            });

            setIsLoggedIn(true);
        }catch(error){
            console.error('Failed to login user: ', error);
            setAlertMessage('Failed to login user');
        }
    }

    const areLoginFieldsValid = () => {
        let valid = true;

        if(!passwordInput){
            setInputErrors(prevErrors => ({
                ...prevErrors,
                password: "Password cannot be empty",
            }));

            valid = false;
        }

        if(!emailInput){
            setInputErrors(prevErrors => ({
                ...prevErrors,
                email: "Email cannot be empty",
            }));

            valid = false;
        }else if (!isEmail(emailInput)){
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

        if(!areLoginFieldsValid()){
            return;
        }

        await loginUser();
    };

    const handleRegisterButton = async () => {
        resetErrors();

        if(!areRegisterFieldsValid()){
            return;
        }

        try{
            await addUser(emailInput, passwordInput);
            await loginUser();
        }catch(error){
            //TODO display error message to user using DisplayAlert component
            console.error('Failed to register user: ', error);
            setAlertMessage('Failed to register user.');
        }
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code !== "Enter") {
            return;
        }

        try{
            await handleLoginButton();
        }catch(error){
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

