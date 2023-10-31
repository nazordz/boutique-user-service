import User, { Role } from "@/models/user";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

export async function createUser(req: Request<{}, {}, CreateUserRequest>, res: Response) {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.status(400).send({ errors: isValid.mapped() });
    return
  }
  try {
    const user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      username: req.body.username,
      role: Role.User,
    })
    res.json(user);
  } catch (error) {
    console.error(error)
    res.status(500).send({ errors: error });
  }
}

export async function getUsers(req: Request, res: Response) {
  const users = await User.findAll();
  res.json(users);
}

export async function findUser(req: Request<{userId: string}>, res: Response) {
  const user = await User.findByPk(req.params.userId);
  return res.json(user);
}