import {check, validationResult} from 'express-validator';
import {Request, Response, NextFunction} from "express";
import {isUserRegistered} from "../dbHandler";

const validateRegistrationFields = [
    check('email').isEmail(),
    check('password').isStrongPassword({minLength: 8 ,minUppercase: 1, minLowercase: 1, minNumbers: 1})
];

export const registrationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email } = req.body;

    const userRegistered = await isUserRegistered(email);
    if(userRegistered){
        res.status(409).json('user already exists');
        return;
    }

    next();
}