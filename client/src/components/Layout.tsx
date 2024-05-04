import {Container, Paper, useTheme} from "@mui/material";
import React from "react";

const Layout: React.FC<React.PropsWithChildren<any>> = (props) => {
    const theme = useTheme();

    return (
            <Container
                maxWidth={false}
                sx={{
                height: "100vh",
                padding: 0,
                backgroundColor: theme.palette.background.default,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Paper elevation={5}
                       sx={{
                           width: "100%",
                           maxWidth: "sm",
                           height: "100vh",
                           overflow: "auto"
                }}>
                    {props.children}
                </Paper>
            </Container>
    )
}

export default Layout;