import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Hobby } from "../entity/Hobby";
import { Route } from "../entity/Route";
import { UserHobby } from "../entity/UserHobby";

export class HobbyController {
  private hobbyRepository = AppDataSource.getRepository(Hobby);
  private routeRepository = AppDataSource.getRepository(Route);
  private userHobbyRepository = AppDataSource.getRepository(UserHobby);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.hobbyRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const hobby = await this.hobbyRepository.findOne({
      where: { id },
    });

    if (!hobby) {
      return "hobby not found";
    }
    return hobby;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    //const { id, name, type, place, attempts, attemptDuration } = request.body;
    const hobbyData: Hobby = request.body;

    const errCount = this.validateData(hobbyData, response);
    if (errCount > 0) {
      return;
    }

    const hobby = Object.assign(new Hobby(), hobbyData);

    return this.hobbyRepository.save(hobby);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let hobbyToRemove = await this.hobbyRepository.findOneBy({ id });

    if (!hobbyToRemove) {
      return "this hobby does not exist";
    }

    await this.deleteOfHobby(id);

    await this.hobbyRepository.remove(hobbyToRemove);

    return "hobby has been removed";
  }

  private validateData(hobby: Hobby, response: Response): number {
    let errCount = 0;
    const errCode = 418;

    if (hobby.name === "") {
      response.status(errCode).json({ error: "Empty name" });
      errCount++;
    } else if (hobby.type.toString() === "") {
      response.status(errCode).json({ error: "Empty type" });
      errCount++;
    } else if (hobby.place.toString() === "") {
      response.status(errCode).json({ error: "Empty place" });
      errCount++;
    }

    return errCount;
  }

  private async deleteOfHobby(id: number) {
    await this.userHobbyRepository.createQueryBuilder()
      .delete()
      .where("hobbyId = :hobbyId", { hobbyId: id })
      .execute();
    await this.routeRepository.createQueryBuilder()
      .delete()
      .where("hobbyId = :hobbyId", { hobbyId: id })
      .execute();
  }
}
