import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import {
  HobbyRecommendationCoefficient,
  HobbyRecommendationCoefficientField,
  HobbyRecommendationCoefficientOperation,
} from "../entity/HobbyRecommendationCoefficient";

export class HobbyRecommendationCoefficientController {
  private hobbyRecommendationCoefficientRepository =
    AppDataSource.getRepository(HobbyRecommendationCoefficient);

  async get(request: Request, response: Response, next: NextFunction) {
    return this.hobbyRecommendationCoefficientRepository.find();
  }

  async edit(request: Request, response: Response, next: NextFunction) {
    const hobbyCoefficients: HobbyRecommendationCoefficient[] = request.body;

    if (this.checkDataValidity(hobbyCoefficients, response)) {
      return;
    }

    await this.hobbyRecommendationCoefficientRepository.clear();
    const newCoefficients =
      this.hobbyRecommendationCoefficientRepository.create(hobbyCoefficients);
    return this.hobbyRecommendationCoefficientRepository.save(newCoefficients);
  }

  private checkDataValidity(
    hobbyCoefficients: HobbyRecommendationCoefficient[],
    response: Response
  ): boolean {
    const errCode = 401;

    return hobbyCoefficients.some((hobbyCoefficient) => {
      if (
        !Object.values(HobbyRecommendationCoefficientField).includes(
          hobbyCoefficient.field
        )
      ) {
        response.status(errCode).json({ error: "Invalid field value" });
        return true;
      }
      if (
        !Object.values(HobbyRecommendationCoefficientOperation).includes(
          hobbyCoefficient.operation
        )
      ) {
        response.status(errCode).json({ error: "Invalid operation value" });
        return true;
      }
      if (Number(hobbyCoefficient.number) !== hobbyCoefficient.number) {
        response.status(errCode).json({ error: "Invalid number value" });
        return true;
      }
      if (
        Number(hobbyCoefficient.priority) !== hobbyCoefficient.priority ||
        hobbyCoefficient.priority % 1 !== 0
      ) {
        response.status(errCode).json({ error: "Invalid priority value" });
        return true;
      }

      return false;
    });
  }
}
