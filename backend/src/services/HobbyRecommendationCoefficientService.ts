import { AppDataSource } from "../data-source";
import {
  HobbyRecommendationCoefficient,
  HobbyRecommendationCoefficientField,
  HobbyRecommendationCoefficientOperation,
} from "../entity/HobbyRecommendationCoefficient";

export class HobbyRecommendationCoefficientService {
  private cache = {};

  constructor() {
    this.getCoefficientedValue = this.getCoefficientedValue.bind(this);
  }

  async getCoefficientedValue(
    field: HobbyRecommendationCoefficientField,
    value: number = 1
  ) {
    const coefficients = this.cache?.[field]
      ? this.cache[field]
      : await AppDataSource.getRepository(HobbyRecommendationCoefficient).find({
          where: { field },
          order: {
            priority: "DESC",
          },
        });
    this.cache[field] = coefficients;

    if (!coefficients || !coefficients.length) {
      return value;
    }

    return coefficients.reduce((accumulator, coefficient) => {
      switch (coefficient.operation) {
        case HobbyRecommendationCoefficientOperation.ADD:
          return accumulator + coefficient.number;
        case HobbyRecommendationCoefficientOperation.LOG:
          return Math.log(accumulator) / Math.log(coefficient.number);
        case HobbyRecommendationCoefficientOperation.MULTIPLY:
          return accumulator * coefficient.number;
        case HobbyRecommendationCoefficientOperation.POW:
          return Math.pow(accumulator, coefficient.number);
        default:
          return accumulator;
      }
    }, value);
  }
}
