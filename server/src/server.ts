import dotenv from 'dotenv';
dotenv.config(); //load environment variables defined in .env file
import express from 'express';
const app = express();
import bcrypt from 'bcrypt';
const PORT = process.env.PORT || 8080;
const saltRounds = 10;
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth';
import {addTaskToDB, addUser, getUserPassword, deleteUser, deleteTask, updateTask, getUserTasks} from './dbHandler';
import http from 'http';
import path from 'path';
import {initializeSocket} from './socketHandler';
const httpServer = http.createServer(app);
import cors from 'cors';
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

app.post('/tasks', authenticateToken, async (req, res) => {
    const task = req.body.task;
    const email = req.user?.email;

    //TODO: check if task is valid (not null and of type Todo)

    if(!email){
        console.error('request missing user property');
        res.status(500).json('internal server error');
        return;
    }

    try{
        await addTaskToDB(task, email);
        console.log('task successfully added to db');
        res.status(200).json('task added');
    }catch(error){
        console.error('failed to add task to db: ', error);
        res.status(500).json('internal server error');
    }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    const taskID = req.params.id;

    try{
        await deleteTask(taskID);
        console.log('task successfully removed from db');
        res.status(200).json('task removed');
    }catch(error){
        console.error('failed to remove task from db: ', error);
        res.status(500).json('internal server error');
    }
});

app.patch('/tasks', authenticateToken, async (req, res) => {

    const taskID = req.body.id;
    const updateData = req.body.updateData;

    try{
        await updateTask(taskID, updateData);
        console.log('task successfully updated on db');
        res.status(200).json('task updated');
    }catch(error){
        console.error('failed to update task on db', error);
        res.status(500).json('internal server error');
    }
});

app.get('/tasks', authenticateToken, async (req, res) => {
    const email = req.user?.email; // user was set by the auth middleware

    if(!email){
        console.error('request missing user property');
        res.status(500).json('internal server error');
        return;
    }

    try{
        const tasks = await getUserTasks(email);
        res.json(tasks);
    }catch(error){
        console.error('failed to retrieve user tasks: ', error);
        res.status(500).json('internal server error');
    }
});

app.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, async (_err, hashedPassword) => {

        if (!email || !hashedPassword) {
            res.status(400).json('invalid request');
            return;
        }
        try{
            await addUser(email, hashedPassword);
            res.status(200).json('user added');
        }catch(error){
            console.error('failed to add user to DB: ', error);
            res.status(500).json('failed to add user');
        }
    });
});

app.delete('/users', authenticateToken, async (req, res) => {
    const emailToDelete = req.body.user.email;

    if (!emailToDelete) {
        res.status(400).json('invalid request');
        return;
    }

    try{
        await deleteUser(emailToDelete);
        res.json('user deleted');
    }catch(error){
        console.error('failed to delete user: ', error);
        res.status(500).json('failed to delete user');
    }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const hashedPassword = await getUserPassword(email);
    if (!hashedPassword) {
        res.status(401).json('Invalid credentials');
        return;
    }

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if(!passwordMatch){
        res.status(401).json('Invalid credentials');
        return;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if(!secretKey){
        res.status(500).json('Internal server error');
        return;
    }

    const token = jwt.sign({email: email}, secretKey, {expiresIn: '7d'});

    res.json({
        accessToken: token,
    });
});

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, BUILD_PATH + "index.html"));
})

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log('server is running on port: ', PORT);
})





