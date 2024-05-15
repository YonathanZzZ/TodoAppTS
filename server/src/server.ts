import dotenv from 'dotenv';
dotenv.config(); //load environment variables defined in .env file
import express from 'express';
const app = express();
const PORT = process.env.PORT || 8080;
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';
import {initializeSocket} from './socketHandler';
const httpServer = http.createServer(app);
import cors from 'cors';
import taskRouter from "./routes/taskRouter";
import userRouter from "./routes/userRouter";
const BUILD_PATH = "../client/build/";

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, BUILD_PATH)));

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){
    console.log('server running in development environment');
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
}

app.use('/api/tasks', taskRouter);
app.use('/users', userRouter);

app.use("/", (req, res) => {
    res.send("Server is running");
})

// app.get("*", (_req, res) => {
//     // res.sendFile(path.join(__dirname, BUILD_PATH + "index.html"));
//     res.send("Server is running");
// })

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log('server is running on port: ', PORT);
})