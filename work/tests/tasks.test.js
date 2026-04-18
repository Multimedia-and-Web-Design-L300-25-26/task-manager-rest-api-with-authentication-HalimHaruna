import request from "supertest";
import app from "./setup.js";

let token;
let taskId;

describe("Task Routes", () => {
  it("should not allow access without token", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    // Register and login to get a token
    await request(app).post("/api/auth/register").send({
      name: "Task User",
      email: "task@example.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "task@example.com",
      password: "123456",
    });

    token = loginRes.body.token;

    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");

    taskId = res.body._id;
  });

  it("should get user tasks only", async () => {
    // Register and login to get a token
    await request(app).post("/api/auth/register").send({
      name: "Task User 2",
      email: "task2@example.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "task2@example.com",
      password: "123456",
    });

    token = loginRes.body.token;

    // Create a task first
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing",
      });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
