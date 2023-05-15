import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

export enum HobbyRecommendationCoefficientField {
  HOBBIES_FROM_MOST_SIMILIAR_USERS_COUNT = "HobbiesFromMostSimiliarUsersCount",
  HOBBIES_FROM_HOBBY_CATEGORIES_COUNT = "HobbiesFromHobbyCategoriesCount",
  HOBBIES_FROM_GLOBAL_POPULARITY_COUNT = "HobbiesFromGlobalPopularityCount",
  HOBBIES_FROM_FRIEND_POPULARITY_COUNT = "HobbiesFromFriendPopularityCount",
  RATING_SUM_FROM_SIMILIAR_USER_OF_HOBBIES = "RatingSumFromSimiliarUserOfHobbies",
  AVG_RATING_FROM_HOBBY_CATEGORIES_OF_HOBBIES = "AvgRatingFromHobbyCategoriesOfHobbies",
  HOBBY_COUNT_FROM_GLOBAL_POPULARITY_OF_HOBBIES = "HobbyCountFromGlobalPopularityOfHobbies",
  HOBBY_COUNT_FROM_FRIEND_POPULARITY_OF_HOBBIES = "HobbyCountFromFriendPopularityOfHobbies",
}

export enum HobbyRecommendationCoefficientOperation {
  MULTIPLY = "multiply",
  ADD = "add",
  POW = "pow",
  LOG = "log",
}

@Entity()
export class HobbyRecommendationCoefficient {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: HobbyRecommendationCoefficientField })
  field: HobbyRecommendationCoefficientField;

  @Column({ type: "enum", enum: HobbyRecommendationCoefficientOperation })
  operation: HobbyRecommendationCoefficientOperation;

  @Column({ type: "float" })
  number: number;

  @Column({ type: "int" })
  priority: number;
}
