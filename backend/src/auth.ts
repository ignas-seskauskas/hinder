import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/login" || req.path === "/register") {
    return next();
  }

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [nickname, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");

  const user = await AppDataSource.getRepository(User).findOneBy({ nickname });

  if (user && user.password === password) {
    // Attach user to the request object
    req.user = user;
    return next();
  }

  res.status(401).send("Authentication required");
};

export default auth;
