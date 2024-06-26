import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {User} from "../../interfaces/user.interface";
import {UserRequest} from "../../interfaces/userRequest.interface";

const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
    throw new Error('Missing JWT secret key');
}

const extractTokenFromHeader = (authHeader: string) => {
    const tokenArray = authHeader.split(' ');

    if (tokenArray.length !== 2 || tokenArray[0].toLowerCase() !== 'bearer') {
        return null;
    }

    return tokenArray[1];
}

const isUser = (payload: string | JwtPayload): payload is User => {
    return (payload as User).email !== undefined;
}
export const authenticateToken =  (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json('Unauthorized: missing auth header');
        return;
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
        res.status(401).json('Unauthorized: missing token');
        return;
    }
    let user;
    try{
        user = jwt.verify(token, secretKey);
        if(!isUser(user)){
            throw new Error();
        }

        req.user = user;
        next();
    }catch(error){
        res.status(403).json('Forbidden: invalid token');
    }
};


