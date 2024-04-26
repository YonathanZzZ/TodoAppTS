import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

// interface User{
//     email: string
// }

export const verifyToken = (token: string): Promise<any> => { // Adjust 'any' to your user object type
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        return Promise.reject(new Error('Missing JWT secret key'));
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

const extractTokenFromHeader = (authHeader: string) => {
    const tokenArray = authHeader.split(' ');

    if (tokenArray.length !== 2 || tokenArray[0].toLowerCase() !== 'bearer') {
        return false;
    }

    return tokenArray[1];
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).json('Unauthorized: missing auth header');
        return;
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
        res.status(401).json('Unauthorized: missing token');
    } else {
        const user = await verifyToken(token);
        if (!user) {
            res.status(403).json('Forbidden: invalid token');
        } else {
            req.body.user = user;
            next();
        }
    }
};

