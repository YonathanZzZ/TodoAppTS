import { describe } from "node:test";
import request from "supertest";
import { server } from "../src";
import {deleteTask, deleteUser} from "../src/dbHandler";

let token: string;

beforeAll(async () => {
    //create user and get token
    const user = {email: 'exampleEmail@example.com', password: 'SrRc7hV@iV27d2'};
    await request(server).post('/users/register').send(user);
    const res = await request(server).post('/users/login').send(user);

    token = res.body.accessToken;
})

afterAll(async () => {
    await deleteUser('exampleEmail@example.com');
})

describe('Test task routes', () => {
    const exampleTask = {task: {content: 'testContent', done: false, id: 'c813c5de-0b2a-4ff3-8ba1-f729138f62c2'}};

    test("Add task - Success", async () => {
        const res = await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);

        expect(res.status).toBe(200);
        expect(res.body).toBe("task added");

        await deleteTask(exampleTask.task.id);
    });

    test("Add task - Missing Authentication", async () => {
        const res = await request(server).post("/api/tasks").send(exampleTask);

        expect(res.status).toBe(401);
    });

    test("Add task - Invalid Token", async () => {
        const res = await request(server).post("/api/tasks").set('Authorization', `Bearer invalidToken`).send(exampleTask);

        expect(res.status).toBe(403);
    });

    test("Delete task - Success", async () => {
        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);
        const res = await request(server).delete(`/api/tasks/${exampleTask.task.id}`).set('Authorization', `Bearer ${token}`).send();

        expect(res.status).toBe(200);
        expect(res.body).toBe("task removed");
    });

    test("Delete task - Invalid ID", async () => {
        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);
        const res = await request(server).delete('/api/tasks/123').set('Authorization', `Bearer ${token}`).send();

        expect(res.status).toBe(400);

        await deleteTask(exampleTask.task.id);
    });

    test("Delete task - Task Does Not Exist", async () => {
        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);
        const res = await request(server).delete('/api/tasks/a813c5de-0b2a-4ff3-8ba1-f729138f62c2').set('Authorization', `Bearer ${token}`).send();

        expect(res.status).toBe(404);

        await deleteTask(exampleTask.task.id);
    });

    test("Update Task Content - Success", async () => {
        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);

        const update = {id: exampleTask.task.id, updateData: {content: "updatedContent"}};
        const res = await request(server).patch("/api/tasks").set('Authorization', `Bearer ${token}`).send(update);

        expect(res.status).toBe(200);

        await deleteTask(exampleTask.task.id);
    });

    test("Update Task Done - Success", async () => {
        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);

        const update = {id: exampleTask.task.id, updateData: {done: false}};
        const res = await request(server).patch("/api/tasks").set('Authorization', `Bearer ${token}`).send(update);

        expect(res.status).toBe(200);

        await deleteTask(exampleTask.task.id);
    });

    test("Get User Tasks - Success", async () => {
        const anotherTask = {task: {content: 'anotherTask', done: true, id: 'c813c5de-0b2f-4ff3-8ba1-f729138f62c2'}};

        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(exampleTask);
        await request(server).post("/api/tasks").set('Authorization', `Bearer ${token}`).send(anotherTask);

        const res = await request(server).get("/api/tasks").set('Authorization', `Bearer ${token}`).send();

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);

        await deleteTask(exampleTask.task.id);
        await deleteTask(anotherTask.task.id);
    });
});