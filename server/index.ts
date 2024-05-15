import dotenv from 'dotenv';
dotenv.config(); //load environment variables defined in .env file
import express from 'express';
const app = express();
const PORT = process.env.PORT;
import cookieParser from 'cookie-parser';
import http from 'http';
import {initializeSocket} from './src/socketHandler';
const httpServer = http.createServer(app);
import cors from 'cors';
import taskRouter from "./src/routes/taskRouter";
import userRouter from "./src/routes/userRouter";

app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
// }));

// app.use('/api/tasks', taskRouter);
// app.use('/users', userRouter);

app.get("/", (_req, res) => {
    res.send("Server is running");
})

// initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log('server is running on port: ', PORT);
})