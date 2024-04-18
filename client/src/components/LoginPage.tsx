import Stack from "@mui/material/Stack";
import {Box, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useState} from "react";
import Button from "@mui/material/Button";
import {addUser, validateUser} from "./sendRequestToServer";
import Cookies from 'js-cookie';
import isEmail from 'validator/lib/isEmail';

interface LoginPageProps {
    setEmail: Dispatch<SetStateAction<string>>
}

export const LoginPage = ({setEmail}: LoginPageProps) => {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [inputError, setInputError] = useState("");

    const loginUser = () => {
        validateUser(emailInput, passwordInput).then((res) => {
            const token = res.data.accessToken;
            if (!token) {
                console.error('failed to extract token from server response');
                return;
            }

            Cookies.set('token', token, {
                sameSite: 'strict',
                secure: true
            });

            setEmail(emailInput);
            setPasswordInput("");

        }).catch((error) => {
            console.error('user unauthorized: ', error);
        });
    }
    const handleLoginButton = () => {
        loginUser();
    };

    const handleRegisterButton = () => {
        if (!isEmail(emailInput)) {
            setInputError('Invalid email address');
            return;
        } else {
            setInputError("");
        }

        addUser(emailInput, passwordInput).then(() => {
            loginUser();
        }).catch((error) => {
            console.error('failed to register user: ', error);
        });
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter") {
            handleLoginButton();
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

