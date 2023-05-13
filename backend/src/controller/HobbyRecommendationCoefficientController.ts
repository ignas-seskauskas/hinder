import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { HobbyRecommendationCoefficient } from "../entity/HobbyRecommendationCoefficient";

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
      if (!hobbyCoefficient.field) {
        response
          .status(errCode)
          .json({ error: "Empty field in one of the coefficients" });
        return true;
      }
      if (!hobbyCoefficient.operation) {
        response
          .status(errCode)
          .json({ error: "Empty operation in one of the coefficients" });
        return true;
      }
      if (Number(hobbyCoefficient.number) !== hobbyCoefficient.number) {
        response
          .status(errCode)
          .json({ error: "Incorrect number value in one of the coefficients" });
        return true;
      }

      return false;
    });
  }
}
