import express from "express";
import supertest from "supertest";
import { expect, it } from "vitest";

import apiRouter from "./index";

const app = express();
app.use("/api", apiRouter);

it("should respond with a welcome message on GET /api", async () => {
  const response = await supertest(app).get("/api");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Rogémon!");
}, 20000);

it("should use authRouter on /api/auth", async () => {
  const response = await supertest(app).get("/api/auth/profile");
  expect(response.status).not.toBe(404);
}, 20000);

it("should use userRouter on /api/user", async () => {
  const response = await supertest(app).get("/api/user");
  expect(response.status).not.toBe(404);
}, 20000);
