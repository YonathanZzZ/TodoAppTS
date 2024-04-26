import axios from 'axios';
import Cookies from "js-cookie";
import {Todo} from "../../../shared/todo-item.interface.ts";
const serverURL = import.meta.env.DEV ? `http://localhost:8080` : '';

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
    if(error.response && (error.response.status === 401 || error.response.status === 403)){
        Cookies.remove('token');
        
        if(authErrorHandler){
            authErrorHandler();
        }
    }

    return Promise.reject(error);
}

axiosInstance.interceptors.response.use(response => response, handleAuthError);

export const setAuthErrorHandler = (handler: () => void) => {
    authErrorHandler = handler;
};

export const getTasksFromDB = async (email: string) => {
    try {
        const res = await axiosInstance.get(`${serverURL}/tasks/${email}`);
        const tasks: Todo[] = res.data;
        return tasks;
    } catch (error) {
        throw new Error("Failed to get tasks from server");
    }
};

export const addTaskToDB = async (task: Todo) => {
    const data = {task: task};
    try{
         await axiosInstance.post(`${serverURL}/tasks`, data);
    }catch(error){
        throw new Error("Failed to add task to server");
    }
};

export const deleteTaskFromDB = async (taskID: string) => {
    try{
        await axiosInstance.delete(`${serverURL}/tasks/${taskID}`);

    }catch (error) {
        throw new Error("Failed to delete task from server");
    }
};

export const editTaskOnDB = async (taskID: string, updateData: any) => {
    try{
        await axiosInstance.patch(`${serverURL}/tasks`, {
            id: taskID, updateData: updateData
        });
    }catch(error) {
        throw new Error("Failed to edit task on server");
    }
};

export const addUser = async (email: string, password: string) => {
    try{
        await axiosInstance.post(`${serverURL}/register`, {
            email: email,
            password: password
        });
    }catch(error){
        //TODO: handle possible errors: user already exists (requires changes on server side)
        throw new Error("Failed to register user");
    }
};

export const getAccessToken = async (email: string, password: string) => {
    try{
        const res = await axiosInstance.post(`${serverURL}/login`, {
            email: email,
            password: password
        });

        return res.data.accessToken;
    }catch(error){
        //TODO: handle possible errors: user does not exist or wrong password (requires changes on server side)
        throw new Error("Failed to validate user");
    }
};

export const deleteUserFromDB = async () => {
    try{
        await axiosInstance.delete(`${serverURL}/users`);
    }catch(error){
        throw new Error("Failed to delete user from server");
    }
};







