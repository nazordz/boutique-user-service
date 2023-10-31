import "module-alias/register";
import bodyParser from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { getEnv } from "./configs/env";
import { checkSchema } from "express-validator";
import { authLogin, currentUser, refreshToken } from "./controllers/authController";
import { isAdmin, verifyJwt } from "./middlewares/authJwt";
import { createUser, findUser, getUsers } from "./controllers/userController";

const app: Express = express();
const port = getEnv("PORT", "8000");

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
const limiter = rateLimit({
  max: 1000,
  windowMs: 1 * 60 * 1000,
});
app.use("*", limiter);

app.use(express.json());

app.post(
  "/login",
  checkSchema(
    {
      email: {
        notEmpty: true,
        isEmail: true,
        errorMessage: "email is required",
      },
      password: { notEmpty: true, errorMessage: "password is required" },
    },
    ["body"]
  ),
  authLogin
);

app.post("/refresh", verifyJwt, refreshToken);
app.get("/current-user", verifyJwt, currentUser);

app.post(
  "/users",
  [verifyJwt, isAdmin],
  checkSchema({
    email: {
      notEmpty: true,
      isEmail: true,
    },
    username: {
      notEmpty: true,
    },
    password: {
      notEmpty: true,
    },
  }, [
    "body"
  ]),
  createUser
);

app.get("/users", [verifyJwt, isAdmin], getUsers);
app.get("/users/:userId", [verifyJwt, isAdmin], findUser);

app.all("*", (req, res, next) => {
  res.status(404).json({
    message: "page not found",
  });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
