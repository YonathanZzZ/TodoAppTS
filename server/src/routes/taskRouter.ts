import {authenticateToken} from "../middleware/auth";
import {addTaskToDB, deleteTask, getUserTasks, updateTask} from "../dbHandler";
import express from "express";
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const task = req.body.task;
    const email = req.user?.email;

    //TODO: check if task is valid (not null and of type Todo)

    if(!email){
        console.error('request missing user property');
        res.status(500).json('internal server error');
        return;
    }

    try{
        await addTaskToDB(task, email);
        console.log('task successfully added to db');
        res.status(200).json('task added');
    }catch(error){
        console.error('failed to add task to db: ', error);
        res.status(500).json('internal server error');
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const taskID = req.params.id;

    try{
        await deleteTask(taskID);
        console.log('task successfully removed from db');
        res.status(200).json('task removed');
    }catch(error){
        console.error('failed to remove task from db: ', error);
        res.status(500).json('internal server error');
    }
});

router.patch('/', authenticateToken, async (req, res) => {

    const taskID = req.body.id;
    const updateData = req.body.updateData;

    try{
        await updateTask(taskID, updateData);
        console.log('task successfully updated on db');
        res.status(200).json('task updated');
    }catch(error){
        console.error('failed to update task on db', error);
        res.status(500).json('internal server error');
    }
});

router.get('/', authenticateToken, async (req, res) => {
    const email = req.user?.email; // user was set by the auth middleware

    if(!email){
        console.error('request missing user property');
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