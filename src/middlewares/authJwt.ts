import { getEnv } from "@/configs/env";
import User, { Role } from "@/models/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  try {
    var token = req.headers["authorization"];
    if (!token) {
      throw new Error("No token provided!");
    }
    token = token.replace("Bearer ", "");
    jwt.verify(token, getEnv("JWT_SECRET_KEY"), (err, decoded) => {
      if (err) {
        return res.status(403).json(err);
      }
      // @ts-ignore
      req.user = decoded.user;
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "No token provided!",
    });
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    var token = req.headers["authorization"];
    if (!token) {
      throw new Error("No token provided!");
    }
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      getEnv("JWT_SECRET_KEY")
    ) as jwt.JwtPayload;
    const loggedUser = decoded["user"] as User;

    if (loggedUser!.role == Role.Admin) {
      next();
    } else {
      return res.status(401).json({
        message: "not authorized",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "No token provided!",
    });
  }
}
