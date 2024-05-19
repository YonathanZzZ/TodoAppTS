import {describe} from "node:test";
import request from "supertest";
import {server} from "../src";
import {deleteUser} from "../src/dbHandler";

describe("Test user routes", () => {
    test("Register User - Success", async () => {
        const email = "testEmail@example.com";
        const requestBody = { email: email, password: "SrRc7hV@iV27d2" };
        const res = await request(server).post("/users/register").send(requestBody);

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toBe("user added");

        await deleteUser(email);
    });

    test("Register User - User Already Registered", async () => {
        const email = "testEmail@example.com";
        const requestBody = { email: email, password: "SrRc7hV@iV27d2" };
        await request(server).post("/users/register").send(requestBody);

        const res = await request(server).post("/users/register").send(requestBody);

        expect(res.status).toBe(409);
        expect(res.body).toBe('user already exists');

        await deleteUser(email);
    });

    test("Login User - Success", async () => {
        const email = "testEmail@example.com";
        const password = "SrRc7hV@iV27d2";
        const requestBody = { email: email, password: password };

        await request(server).post("/users/register").send(requestBody);

        const res = await request(server).post("/users/login").send(requestBody);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toHaveProperty("accessToken");

        await deleteUser(email);
    });

    test("Login user - Wrong Email", async () => {
        const email = "testEmail@example.com";
        const password = "SrRc7hV@iV27d2";
        let requestBody = { email: email, password: password };

        //register user
        await request(server).post("/users/register").send(requestBody);

        requestBody.email = "wrongEmail@example.com";

        const res = await request(server).post("/users/login").send(requestBody);
        expect(res.status).toBe(401);
        expect(res.body).toBe("Invalid credentials");

        await deleteUser(email);
    });

    test("Login user - Wrong Password", async () => {
        const email = "testEmail@example.com";
        const password = "SrRc7hV@iV27d2";
        let requestBody = { email: email, password: password };

        //register user
        await request(server).post("/users/register").send(requestBody);

        requestBody.password = "wr0ngPa55w0rd";

        const res = await request(server).post("/users/login").send(requestBody);
        expect(res.status).toBe(401);
        expect(res.body).toBe("Invalid credentials");

        await deleteUser(email);
    });

    test("Delete User - Success", async () => {
        const email = "testEmail@example.com";
        const password = "SrRc7hV@iV27d2";
        const requestBody = { email: email, password: password };

        //register user
        await request(server).post("/users/register").send(requestBody);

        //login
        let res = await request(server).post("/users/login").send(requestBody);
        const token = res.body.accessToken;

        console.log('received token: ', token);

        res = await request(server).delete("/users").set('Authorization', `Bearer ${token}`).send();
        expect(res.status).toBe(200);
        expect(res.body).toBe("user deleted");
    });
});

