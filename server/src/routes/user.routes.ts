import {addUser, deleteUser, getUserPassword, isUserRegistered} from "../dbHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import {authenticateToken} from "../middleware/auth";
import {emailSchema, userSchema} from "../schemas/userSchema";
import {UserRequest} from "../../interfaces/userRequest.interface";
const router = express.Router();
const saltRounds = 10;

router.post('/login', async (req, res) => {
        const parseRes = userSchema.safeParse(req.body);
        if(!parseRes.success){
            res.status(400).json('bad request');
            return;
        }

        const {email, password} = parseRes.data;

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

router.post('/register', async (req, res) => {
         const parseRes = userSchema.safeParse(req.body);
        if(!parseRes.success){
            res.status(400).json('bad request');
            return;
        }

        const {email, password} = parseRes.data;

        const userRegistered = await isUserRegistered(email);
        if(userRegistered){
            res.status(409).json('user already exists');
            return;
        }

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

router.delete('/', authenticateToken, async (req: UserRequest, res) => {
        const parseRes = emailSchema.safeParse(req.user);
        if(!parseRes.success){
            res.status(400).json('bad request');
            return;
        }

        const email = parseRes.data.email;

        try{
            const deleteRes = await deleteUser(email);
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