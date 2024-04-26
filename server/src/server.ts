import dotenv from 'dotenv';
dotenv.config(); //load environment variables defined in .env file
import express from 'express';
const app = express();
import bcrypt from 'bcrypt';
const PORT = process.env.PORT || 8080;
const saltRounds = 10;
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './auth';
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

app.post('/tasks', authenticateToken, (req, res) => {
    // const task = req.body;
    const task = req.body.task;
    const email = req.body.user.email;

    addTaskToDB(task, email).then(() => {
        console.log('task successfully added to db');
        res.status(200).json('task added');
    }).catch((error) => {
        console.error('failed to add task to db: ', error);
        res.status(500).json('internal server error');
    });
});

app.delete('/tasks/:id', authenticateToken, (req, res) => {

    const taskID = req.params.id;

    deleteTask(taskID).then(() => {
        console.log('task successfully removed from db');
        res.status(200).json('task removed');
    }).catch((error) => {
        console.error('failed to remove task from db: ', error);
        res.status(500).json('internal server error');
    });
});

app.patch('/tasks', authenticateToken, (req, res) => {

    const taskID = req.body.id;
    const updateData = req.body.updateData;

    updateTask(taskID, updateData).then(() => {
        console.log('task successfully updated on db');
        res.status(200).json('task updated');
    }).catch((error) => {
        console.error('failed to update task on db', error);
        res.status(500).json('internal server error')
    })
});

app.get('/tasks/:email', authenticateToken, (req, res) => {
    const email = req.params.email;
    //TODO modify this route. the email can be extract from the token (req.body.user.email) so the route shouldn't include the email
    getUserTasks(email).then((tasks) => {
        console.log('successfully retrieved tasks');
        res.status(200).json(tasks);
    }).catch((error) => {
        console.error('failed to retrieve user tasks: ', error);
        res.status(500).json('internal server error');
    });
});

app.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (_err, hashedPassword) => {
        addUser(email, hashedPassword).then(() => {
            console.log('added user to DB');
            res.status(200).json('user added');
        }).catch((error) => {
            console.error('failed to add user to DB: ', error);
            res.status(500).json('failed to add user');
        });
    });
});

app.delete('/users', authenticateToken, (req, res) => {
    const emailToDelete = req.body.user.email;

    if (!emailToDelete) {
        res.status(400).json('invalid request');
        return;
    }

    deleteUser(emailToDelete).then(() => {
        console.log('deleted user: ', emailToDelete);
        res.status(200).json('user deleted');
    }).catch((error) => {
        console.error('failed to delete user: ', error);
        res.status(500).json('failed to delete user');
    });
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await getUserPassword(email);
    if (!hashedPassword) {
        res.status(401).json('Invalid credentials');
        return;
    }

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordMatch) {
        const secretKey = process.env.JWT_SECRET_KEY;
        if(!secretKey){
            res.status(500).json('Internal server error');
            return;
        }
        const token = jwt.sign({email: email}, secretKey, {expiresIn: '7d'});

        res.json({
            accessToken: token,

        });
    } else {
        res.status(401).json('Invalid credentials');
    }
});

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, BUILD_PATH + "index.html"));
})

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log('server is running on port: ', PORT);
})





