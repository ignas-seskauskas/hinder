import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserType } from "../entity/User";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async loginUser(request: Request, response: Response, next: NextFunction) {
    const nickname = request.body.nickname;
    const password = request.body.password;

    const user = await this.userRepository.findOneBy({ nickname });
    if (user && user.password === password) {
      return {
        ...user,
        authorizationHeader: `${nickname}:${password}`,
      };
    }

    response.status(401).json({ error: "Incorrect username/password" });
  }

  async registerUser(request: Request, response: Response, next: NextFunction) {
    const nickname = request.body.nickname;
    const password = request.body.password;
    const email = request.body.email;

    if (await this.userRepository.findOneBy({ nickname })) {
      response.status(400).json({ error: "This nickname is already taken" });
      return;
    }

    if (await this.userRepository.findOneBy({ email })) {
      response.status(400).json({ error: "This email is already taken" });
      return;
    }

    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.password = password;
    user.name = "Name";
    user.surname = "Surname";
    user.type = UserType.HobbyFinder;

    await this.userRepository.save(user);

    return {
      ...user,
      authorizationHeader: `${nickname}:${password}`,
    };
  }
}
