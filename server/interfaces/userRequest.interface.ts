import {Request} from "express";
import {User} from "./user.interface";

export interface UserRequest extends Request{
    user?: User;
}