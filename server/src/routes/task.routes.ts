import {authenticateToken} from "../middleware/auth";
import {addTaskToDB, deleteTask, getUserTasks, updateTask} from "../dbHandler";
import express from "express";
import {Request, Response} from "express";
import {idSchema, todoSchema, updateSchema} from "../schemas/todoSchema";
import {emailSchema} from "../schemas/userSchema";
import {User} from "../../interfaces/user.interface";
import {UserRequest} from "../../interfaces/userRequest.interface";
const router = express.Router();



router.post('/', authenticateToken, async (req: UserRequest, res: Response) => {
    const taskParseRes = todoSchema.safeParse(req.body.task);
    if(!taskParseRes.success){
        res.status(400).json('bad request');
        return;
    }

    const task = taskParseRes.data;

    const emailParseRes = emailSchema.safeParse(req.user);
    if(!emailParseRes.success){
        res.status(400).json('bad request');
        return;
    }

    const email = emailParseRes.data.email;

    try{
        await addTaskToDB(task, email);
        res.status(200).json('task added');
    }catch(error){
        console.error('failed to add task to db: ', error);
        res.status(500).json('internal server error');
    }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const idParseRes = idSchema.safeParse(req.params);
    if(!idParseRes.success){
        res.status(400).json('bad request');
        return;
    }

    const taskID = idParseRes.data.id;

    //TODO modify deleteTask (in dbHandler) to receive both email and taskID, to ensure only the owner of the task can delete it.
    // use email from req.user and validate with schema.

    try{
        const deleteRes = await deleteTask(taskID);
        if(!deleteRes){
            res.status(404).json('the task with the specified ID does not exist.');
            return;
        }

        res.status(200).json('task removed');
    }catch(error){
        res.status(500).json('internal server error.');
    }
});

router.patch('/', authenticateToken, async (req: Request, res: Response) => {

    const idParseRes = idSchema.safeParse(req.body);
    console.log('req.body in patch (update): ', req.body);
    if(!idParseRes.success){
        res.status(400).json('bad request');
        return;
    }

    const taskID = idParseRes.data.id;

    // const updateData = req.body.updateData;
    const updateParseRes = updateSchema.safeParse(req.body.updateData);
    if(!updateParseRes.success){
        res.status(400).json('bad request');
        return;
    }

    const updateData = updateParseRes.data;

    try{
        const updateRes = await updateTask(taskID, updateData);
        if(!updateRes){
            res.status(404).json('task not found');
            return;
        }

        res.status(200).json('task updated');
    }catch(error){
        console.error('failed to update task on db', error);
        res.status(500).json('internal server error');
    }
});

router.get('/', authenticateToken, async (req: UserRequest, res: Response) => {
    const emailParseRes = emailSchema.safeParse(req.user);
    if(!emailParseRes.success){
        res.status(400).json('bad request');
        return;
    }

    const email = emailParseRes.data.email;

    if(!email){
        console.error('request missing email property');
        res.status(500).json('internal server error');
        return;
    }

    try{
        const tasks = await getUserTasks(email);
        res.json(tasks);
    }catch(error){
        console.error('failed to retrieve user tasks: ', error);
        res.status(500).json('internal server error');
    }
});

export default router;