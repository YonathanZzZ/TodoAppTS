import {addUser, deleteUser, getUserPassword} from "../dbHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import {registrationMiddleware} from "../middleware/registration-validation";
import {authenticateToken} from "../middleware/auth";
import {User} from "../../interfaces/user.interface";
const router = express.Router();
const saltRounds = 10;

router.post('/login', async (req, res) => {
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

router.post('/register', registrationMiddleware, async (req, res) => {
    const {email, password} = req.body;

    bcrypt.hash(password, saltRounds, async (_err, hashedPassword) => {
        try{
            await addUser(email, hashedPassword);
            res.status(200).json('user added');
        }catch(error){
            console.error('failed to add user to DB: ', error);
            res.status(500).json('internal server error');
        }
    });
});

router.delete('/', authenticateToken, async (req, res) => {
    const emailToDelete = req.user?.email;

    if (!emailToDelete) {
        res.status(400).json('invalid request');
        return;
    }

    try{
        const deleteRes = await deleteUser(emailToDelete);
        if(!deleteRes){
            res.status(404).json('User not found');
            return;
        }

        res.json('user deleted');
    }catch(error){
        console.error('failed to delete user: ', error);
        res.status(500).json('internal server error');
    }
});

export default router;