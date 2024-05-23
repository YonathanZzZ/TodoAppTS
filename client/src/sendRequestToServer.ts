import axios from 'axios';
import Cookies from "js-cookie";
import {Todo} from "@shared/interfaces/todo-item.interface.ts";

const serverURL = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
    baseURL: serverURL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    });

let authErrorHandler: (() => void) | null = null;

const handleAuthError = (error: any) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        Cookies.remove('token');

        if (authErrorHandler) {
            authErrorHandler();
        }
    }

    return Promise.reject(error);
}

axiosInstance.interceptors.response.use(response => response, handleAuthError);

export const setAuthErrorHandler = (handler: () => void) => {
    authErrorHandler = handler;
};

export const getTasksFromDB = async () => {
    try {
        const res = await axiosInstance.get(`${serverURL}/api/tasks`);
        const tasks: Todo[] = res.data;
        return tasks;
    } catch (error) {
        throw new Error("Failed to get tasks from server");
    }
};

export const addTaskToDB = async (todo: Todo) => {
    const data = {task: todo};
    try {
        await axiosInstance.post(`${serverURL}/api/tasks`, data);
    } catch (error) {
        throw new Error("Failed to add task to server");
    }
};

export const deleteTaskFromDB = async (taskID: string) => {
    try {
        await axiosInstance.delete(`${serverURL}/api/tasks/${taskID}`);

    } catch (error) {
        throw new Error("Failed to delete task from server");
    }
};

export const editTaskOnDB = async (taskID: string, updateData: any) => {
    try {
        await axiosInstance.patch(`${serverURL}/api/tasks`, {
            id: taskID, updateData: updateData
        });
    } catch (error) {
        throw new Error("Failed to edit task on server");
    }
};

export const addUser = async (email: string, password: string) => {
    await axiosInstance.post(`${serverURL}/users/register`, {
        email: email,
        password: password
    });
};

export const getAccessToken = async (email: string, password: string) => {
    const res = await axiosInstance.post(`${serverURL}/users/login`, {
        email: email,
        password: password
    });

    return res.data.accessToken;
};

export const deleteUserFromDB = async () => {
    try {
        await axiosInstance.delete(`${serverURL}/users`);
    } catch (error) {
        throw new Error("Failed to delete user from server");
    }
};







