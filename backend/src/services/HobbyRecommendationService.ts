import { AppDataSource } from "../data-source";
import { Hobby } from "../entity/Hobby";
import { HobbyRecommendationCoefficientField } from "../entity/HobbyRecommendationCoefficient";
import { UserHobby } from "../entity/UserHobby";
import { HobbyRecommendationCoefficientService } from "./HobbyRecommendationCoefficientService";

type HobbyRecommendationCriteriaInstance = Array<{
  hobbyId: number;
  value: number;
}>;

export class HobbyRecommendationService {
  private hobbyRepository = AppDataSource.getRepository(Hobby);
  private userHobbyRepository = AppDataSource.getRepository(UserHobby);
  private hobbyRecommendationCoefficientService =
    new HobbyRecommendationCoefficientService();

  async getRecommendedHobbyForUser(userId: number): Promise<Hobby | null> {
    const getCoefficientedValue =
      this.hobbyRecommendationCoefficientService.getCoefficientedValue;
    const defaultCriteriaHobbyCount = 10;

    const criteria = [
      this.applyCoefficientTransformationToCriteriaInstance(
        await this.getMostRatedUntriedHobbiesFromSimiliarUsers(
          userId,
          await getCoefficientedValue(
            HobbyRecommendationCoefficientField.HOBBIES_FROM_MOST_SIMILIAR_USERS_COUNT,
            defaultCriteriaHobbyCount
          )
        ),
        HobbyRecommendationCoefficientField.RATING_SUM_FROM_SIMILIAR_USER_OF_HOBBIES
      ),
      this.applyCoefficientTransformationToCriteriaInstance(
        await this.getMostAvgRatedUntriedHobbiesFromCategories(
          userId,
          await getCoefficientedValue(
            HobbyRecommendationCoefficientField.HOBBIES_FROM_HOBBY_CATEGORIES_COUNT,
            defaultCriteriaHobbyCount
          )
        ),
        HobbyRecommendationCoefficientField.AVG_RATING_FROM_HOBBY_CATEGORIES_OF_HOBBIES
      ),
      this.applyCoefficientTransformationToCriteriaInstance(
        await this.getMostPopularUntriedHobbies(
          userId,
          await getCoefficientedValue(
            HobbyRecommendationCoefficientField.HOBBIES_FROM_GLOBAL_POPULARITY_COUNT,
            defaultCriteriaHobbyCount
          )
        ),
        HobbyRecommendationCoefficientField.HOBBY_COUNT_FROM_GLOBAL_POPULARITY_OF_HOBBIES
      ),
      this.applyCoefficientTransformationToCriteriaInstance(
        await this.getMostPopularUntriedHobbiesAmongFriends(
          userId,
          await getCoefficientedValue(
            HobbyRecommendationCoefficientField.HOBBIES_FROM_FRIEND_POPULARITY_COUNT,
            defaultCriteriaHobbyCount
          )
        ),
        HobbyRecommendationCoefficientField.HOBBY_COUNT_FROM_FRIEND_POPULARITY_OF_HOBBIES
      ),
    ].flat();

    if (criteria.length < 1) {
      return null;
    }

    const mergedCriteria = criteria.reduce((acc, cur) => {
      let foundHobby = acc.find((hobby) => hobby.hobbyId === cur.hobbyId);

      if (foundHobby) {
        foundHobby.value += cur.value;
      } else {
        acc.push(cur);
      }

      return acc;
    }, []);

    const highestValueHobbyId = mergedCriteria.reduce((acc, cur) => {
      return cur.value > acc.value ? cur : acc;
    }).id;

    return await this.hobbyRepository.findOne({
      where: {
        id: highestValueHobbyId,
      },
    });
  }

  private applyCoefficientTransformationToCriteriaInstance(
    instance: HobbyRecommendationCriteriaInstance,
    coefficientField: HobbyRecommendationCoefficientField
  ) {
    const getCoefficientedValue =
      this.hobbyRecommendationCoefficientService.getCoefficientedValue;

    return instance.map((hobbyAndValue) => ({
      ...hobbyAndValue,
      value: getCoefficientedValue(coefficientField, hobbyAndValue.value),
    }));
  }

  private async getMostRatedUntriedHobbiesFromSimiliarUsers(
    userId: number,
    howManyToGet: number
  ) {
    const batchSize = howManyToGet;
    let hobbies = [];
    let batchNumber = 0;

    while (true) {
      const mostSimilarUsers = await this.userHobbyRepository
        .createQueryBuilder("uh1")
        .select("uh2.userId", "userId")
        .addSelect("COUNT(uh2.hobbyId)", "sharedHobbiesCount")
        .innerJoin(
          UserHobby,
          "uh2",
          "uh1.userId != uh2.userId AND uh1.hobbyId = uh2.hobbyId AND ((uh1.rating <= 5 AND uh2.rating <= 5) OR (uh1.rating > 5 AND uh2.rating > 5))"
        )
        .where("uh1.userId = :userId", { userId })
        .groupBy("uh2.userId")
        .orderBy("sharedHobbiesCount", "DESC")
        .skip(batchNumber * batchSize)
        .take(batchSize)
        .getRawMany();

      if (mostSimilarUsers.length === 0) {
        break;
      }

      const userIds = mostSimilarUsers.map((user) => user.userId);

      for (const similarUserId of userIds) {
        if (hobbies.length >= howManyToGet) {
          break;
        }

        const newHobbies = await this.userHobbyRepository
          .createQueryBuilder("uh")
          .select("uh.hobbyId", "hobbyId")
          .addSelect("SUM(uh.rating)", "value")
          .where("uh.userId = :similarUserId", { similarUserId })
          .andWhere(
            `uh.hobbyId NOT IN (
                    SELECT hobbyId FROM UserHobby WHERE userId = :userId
                )`,
            { userId }
          )
          .groupBy("uh.hobbyId")
          .orderBy("ratingSum", "DESC")
          .getRawMany();

        hobbies = [...hobbies, ...newHobbies];
      }

      batchNumber++;
    }

    return hobbies.slice(
      0,
      howManyToGet
    ) as HobbyRecommendationCriteriaInstance;
  }

  private async getMostAvgRatedUntriedHobbiesFromCategories(
    userId: number,
    howManyToGet: number
  ) {
    const batchSize = howManyToGet;
    let hobbies = [];
    let batchNumber = 0;

    while (true) {
      const bestHobbyCategories = await this.userHobbyRepository
        .createQueryBuilder("uh")
        .select("h.category", "category")
        .addSelect("AVG(uh.rating)", "averageRating")
        .innerJoin(Hobby, "h", "uh.hobbyId = h.id")
        .where("uh.userId = :userId", { userId })
        .groupBy("h.category")
        .orderBy("averageRating", "DESC")
        .skip(batchNumber * batchSize)
        .take(batchSize)
        .getRawMany();

      if (bestHobbyCategories.length === 0) {
        break;
      }

      const categories = bestHobbyCategories.map((hobby) => hobby.category);

      for (const category of categories) {
        if (hobbies.length >= howManyToGet) {
          break;
        }

        const newHobbies = await this.hobbyRepository
          .createQueryBuilder("h")
          .select("h.id", "hobbyId")
          .addSelect(
            `(SELECT AVG(uh.rating) FROM UserHobby uh WHERE uh.hobbyId = h.id)`,
            "value"
          )
          .where("h.category = :category", { category })
          .andWhere(
            `h.id NOT IN (
                    SELECT hobbyId FROM UserHobby WHERE userId = :userId
                )`,
            { userId }
          )
          .orderBy("averageRating", "DESC")
          .getRawMany();

        hobbies = [...hobbies, ...newHobbies];
      }

      batchNumber++;
    }

    return hobbies.slice(
      0,
      howManyToGet
    ) as HobbyRecommendationCriteriaInstance;
  }

  private async getMostPopularUntriedHobbies(
    userId: number,
    howManyToGet: number
  ) {
    const mostPopularHobbies = await this.userHobbyRepository
      .createQueryBuilder("uh")
      .select("uh.hobbyId", "hobbyId")
      .addSelect("COUNT(uh.userId)", "value")
      .where(
        `uh.hobbyId NOT IN (
                SELECT hobbyId FROM UserHobby WHERE userId = :userId
            )`,
        { userId }
      )
      .groupBy("uh.hobbyId")
      .orderBy("popularity", "DESC")
      .limit(howManyToGet)
      .getRawMany();

    return mostPopularHobbies as HobbyRecommendationCriteriaInstance;
  }

  private async getMostPopularUntriedHobbiesAmongFriends(
    userId: number,
    howManyToGet: number
  ) {
    const mostPopularHobbies = await this.userHobbyRepository
      .createQueryBuilder("uh")
      .select("uh.hobbyId", "hobbyId")
      .addSelect("COUNT(uh.userId)", "value")
      .where(
        `uh.userId IN (
            SELECT uf.friendId FROM UserFriend uf WHERE uf.userId = :userId
        )`,
        { userId }
      )
      .andWhere(
        `uh.hobbyId NOT IN (
            SELECT hobbyId FROM UserHobby WHERE userId = :userId
        )`,
        { userId }
      )
      .groupBy("uh.hobbyId")
      .orderBy("popularity", "DESC")
      .limit(howManyToGet)
      .getRawMany();

    return mostPopularHobbies as HobbyRecommendationCriteriaInstance;
  }
}
