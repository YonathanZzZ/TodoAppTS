import Stack from "@mui/material/Stack";
import {Box, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useState} from "react";
import Button from "@mui/material/Button";
import {addUser, getAccessToken} from "./sendRequestToServer";
import Cookies from 'js-cookie';
import isEmail from 'validator/lib/isEmail';

interface LoginPageProps {
    setEmail: Dispatch<SetStateAction<string>>
}

export const LoginPage = ({setEmail}: LoginPageProps) => {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [inputError, setInputError] = useState("");

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

            setEmail(emailInput);
            setPasswordInput("");

        }catch(error){
            throw new Error("Failed to login user");
        }
    }
    const handleLoginButton = async () => {
        try{
            await loginUser();
        }catch(error){
            //TODO display error message to user using DisplayAlert component
        }
    };

    const handleRegisterButton = async () => {
        if (!isEmail(emailInput)) {
            setInputError('Invalid email address');
            return;
        } else {
            setInputError("");
        }

        try{
            await addUser(emailInput, passwordInput);
            await loginUser();
        }catch(error){
            //TODO display error message to user using DisplayAlert component
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
            <TextField
                id="email-field"
                autoFocus={true}
                variant="filled"
                label="Enter email"
                fullWidth={true}
                required={true}
                type="email"
                error={Boolean(inputError)}
                helperText={inputError}
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

