import dotenv from "dotenv";
dotenv.config();
import http from "http";

import {Server} from 'socket.io';
import {SocketEvents} from "@shared/interfaces/socket-io.interface";

export const initializeSocket = (httpServer: http.Server) => {

    const io = new Server<SocketEvents, SocketEvents>(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        }
    });

    io.on('connection', (socket) => {

        let userEmail = socket.handshake.query.email;
        if(typeof userEmail !== 'string'){
            return;
        }

        socket.join(userEmail);

        socket.on('addTask', (newTask) => {
            socket.to(userEmail).emit('addTask', newTask);
        });

        socket.on('deleteTask', (taskID) => {
            //taskID is a string
            socket.to(userEmail).emit('deleteTask', taskID);
        });

        socket.on('editTask', (data) => {
            socket.to(userEmail).emit('editTask', data);
        });

        socket.on('changeTaskDone', (data) => {
            socket.to(userEmail).emit('changeTaskDone', data);
        });
    });
}

