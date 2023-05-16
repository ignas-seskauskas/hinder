import "reflect-metadata";
import { DataSource } from "typeorm";
import { Hobby } from "./entity/Hobby";
import { UserHobby } from "./entity/UserHobby";
import { Route } from "./entity/Route";
import { Node } from "./entity/Node";
import { HobbyRecommendationCoefficient } from "./entity/HobbyRecommendationCoefficient";
import * as dotenv from "dotenv";
import { HobbyCategory } from "./entity/HobbyCategory";
import { User } from "./entity/User";
import { UserFriend } from "./entity/UserFriend";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: process.env.DB_PASSWORD || "root",
  database: "hinder",
  synchronize: true,
  logging: false,
  entities: [
    Hobby,
    UserHobby,
    Route,
    Node,
    HobbyRecommendationCoefficient,
    HobbyCategory,
    User,
    UserFriend,
  ],
  migrations: [],
  subscribers: [],
});
