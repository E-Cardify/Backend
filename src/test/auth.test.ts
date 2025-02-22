import request from "supertest";
import app from "../app";
import User from "../models/User";
import bcrypt from "bcrypt";

describe("Authentication", () => {
  describe("POST /api/v1/user/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/v1/user/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email", "test@example.com");
      expect(response.body).toHaveProperty("firstName", "John");
      expect(response.body).toHaveProperty("lastName", "Doe");
      expect(response.body).not.toHaveProperty("password");

      const user = await User.findOne({ email: "test@example.com" });
      expect(user).toBeTruthy();
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/api/v1/user/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Missing required fields"
      );
    });

    it("should return 409 if email already exists", async () => {
      await User.create({
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "John",
        lastName: "Doe",
      });

      const response = await request(app).post("/api/v1/user/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Jane",
        lastName: "Doe",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "message",
        "Email already registered"
      );
    });
  });

  describe("POST /api/v1/user/login", () => {
    beforeEach(async () => {
      await User.create({
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("email", "test@example.com");
      expect(response.body).toHaveProperty("firstName", "John");
      expect(response.body).toHaveProperty("lastName", "Doe");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 401 with incorrect password", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    it("should return 401 with non-existent email", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app).post("/api/v1/user/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Missing email or password"
      );
    });
  });
});
