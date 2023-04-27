import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { Hobby, HobbyPlace, HobbyType } from "./entity/Hobby";
import * as cors from "cors";
import { UserHobby, UserHobbyStatus } from "./entity/UserHobby";
import { Route, TravellingMethod } from "./entity/Route";

AppDataSource.initialize().then(async () => {
  // create express app
  const app = express();
  app.use(bodyParser.json());

  app.use(cors());

  // register express routes from defined application routes
  Routes.forEach((route) => {
    (app as any)[route.method](
      route.route,
      (req: Request, res: Response, next: Function) => {
        const result = (new (route.controller as any)())[route.action](
          req,
          res,
          next,
        );
        if (result instanceof Promise) {
          result.then((result) =>
            result !== null && result !== undefined
              ? res.send(result)
              : undefined
          );
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      },
    );
  });

  // setup express app here

  // start express server
  app.listen(3000);

  // insert new hobbies for test
  const res = await AppDataSource.manager.find(Hobby);
  if (res.length === 0) {
    const userHobby1 = new UserHobby();
    userHobby1.status = UserHobbyStatus.ATTEMPTED;
    userHobby1.rating = 7;
    await AppDataSource.manager.save(
      userHobby1,
    );
    const userHobby2 = new UserHobby();
    userHobby2.status = UserHobbyStatus.REJECTED;
    userHobby2.rating = 0;
    await AppDataSource.manager.save(
      userHobby2,
    );
    const route1 = new Route();
    route1.name = "Cycling in the park";
    route1.rating = 6;
    route1.distance = 1;
    route1.travellingMethod = TravellingMethod.CYCLING;
    await AppDataSource.manager.save(
      route1,
    );

    await AppDataSource.manager.save(
      AppDataSource.manager.create(Hobby, {
        name: "Cooking",
        type: HobbyType.PASSIVE,
        place: HobbyPlace.INDOORS,
        attempts: 1,
        attemptDuration: 10,
        userHobbies: [userHobby1],
        routes: [],
      }),
    );

    await AppDataSource.manager.save(
      AppDataSource.manager.create(Hobby, {
        name: "Cycling",
        type: HobbyType.ACTIVE,
        place: HobbyPlace.OUTDOORS,
        attempts: 2,
        attemptDuration: 25,
        userHobbies: [userHobby2],
        routes: [route1],
      }),
    );
  }

  console.log(
    "Express server has started on port 3000. Open http://localhost:3000/hobbies to see results",
  );
}).catch((error) => console.log(error));
