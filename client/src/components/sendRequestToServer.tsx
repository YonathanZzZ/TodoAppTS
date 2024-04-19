import axios from 'axios';
import Cookies from "js-cookie";
console.log('PORT env var: ', import.meta.env.PORT);
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

const handleAuthError = (error) => {
    if(error.response && (error.response.status === 401 || error.response.status === 403)){
        Cookies.remove('token');
        
        if(authErrorHandler){
            authErrorHandler();
        }
    }

    return Promise.reject(error);
}

axiosInstance.interceptors.response.use(response => response, handleAuthError);

export const setAuthErrorHandler = (handler) => {
    authErrorHandler = handler;
};

export const getTasksFromDB = (email: string) => {
    return axiosInstance.get(`${serverURL}/tasks/${email}`);
};

export const addTaskToDB = (task) => {

    return axiosInstance.post(`${serverURL}/tasks`, task);
};

export const deleteTaskFromDB = (taskID: string) => {

    return axiosInstance.delete(`${serverURL}/tasks/${taskID}`);
};

export const editTaskOnDB = (identifier, newData) => {

    return axiosInstance.patch(`${serverURL}/tasks`, {
        taskIdentifier: identifier, newTaskData: newData
    });
};

export const addUser = (email: string, password: string) => {
    return axiosInstance.post(`${serverURL}/register`, {
        email: email,
        password: password
    });
};

export const validateUser = (email: string, password: string) => {
    return axiosInstance.post(`${serverURL}/login`, {
        email: email,
        password: password
    });
};

export const deleteUserFromDB = () => {
    return axiosInstance.delete(`${serverURL}/users`);
};







