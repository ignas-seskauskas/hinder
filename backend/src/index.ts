import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { Hobby, HobbyPlace, HobbyType } from "./entity/Hobby";
import * as cors from "cors";
import { UserHobby, UserHobbyStatus } from "./entity/UserHobby";
import { Route, TravellingMethod } from "./entity/Route";
import { User, UserType } from "./entity/User";
import auth from "./auth";
import { UserFriend } from "./entity/UserFriend";
import { HobbyCategory } from "./entity/HobbyCategory";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use(auth);

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
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
        }
      );
    });

    // setup express app here

    // start express server
    app.listen(3000);

<<<<<<< HEAD
  // insert test data
  await seedDB();

  console.log(
    "Express server has started on port 3000. Open http://localhost:3000/hobbies to see results",
  );
}).catch((error) => console.log(error));

async function seedDB() {
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
    route1.travellingMethod = TravellingMethod.Bicycle;
    await AppDataSource.manager.save(
      route1,
    );
=======
    // insert new hobbies for test
    const res = await AppDataSource.manager.find(Hobby);
    if (res.length === 0) {
      const adminUser = new User();
      adminUser.email = "admin@admin.com";
      adminUser.name = "Admin";
      adminUser.nickname = "admin";
      adminUser.password =
        "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
      adminUser.surname = "Admin";
      adminUser.type = UserType.Admin;
      const adminUserCreated = await AppDataSource.manager.save(adminUser);
>>>>>>> 4aa94b4c173056b8870cea49824bd3d4630e7d6a

      const otherUser = new User();
      otherUser.email = "other@other.com";
      otherUser.name = "Other";
      otherUser.nickname = "other";
      otherUser.password =
        "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
      otherUser.surname = "Other";
      otherUser.type = UserType.HobbyFinder;
      const otherUserCreated = await AppDataSource.manager.save(otherUser);

      const userFriend = new UserFriend();
      userFriend.friend = adminUserCreated;
      userFriend.searcher = otherUserCreated;
      userFriend.friendshipStartDate = new Date("2023-05-16");
      userFriend.requestSent = true;
      await AppDataSource.manager.save(userFriend);

<<<<<<< HEAD
  // insert new routes for test
  const res1 = await AppDataSource.manager.find(Route);
  if (res1.length === 0) {
    //const route1 = new Route();
    //route1.name = "Kaunas City";
    //route1.hobby = res[0];
    //route1.rating = 5;
    //route1.distance = 15;
    //route1.travellingMethod = TravellingMethod.Bicycle;
    //await AppDataSource.manager.save(
    //  route1,
    //);
    //const route2 = new Route();
    //route2.name = "Vilnius City";
    //route2.hobby = res[1];
    //route2.rating = 5;
    //route2.distance = 10;
    //route2.travellingMethod = TravellingMethod.Walk;
    //await AppDataSource.manager.save(
    //  route2,
    //);

    //await AppDataSource.manager.save(
    //  AppDataSource.manager.create(Hobby, {
    //    name: "Cooking",
    //    type: HobbyType.PASSIVE,
    //    place: HobbyPlace.INDOORS,
    //    attempts: 1,
    //    attemptDuration: 10,
    //    userHobbies: [userHobby1],
    //    routes: [],
    //  }),
    //);

    //await AppDataSource.manager.save(
    //  AppDataSource.manager.create(Hobby, {
    //    name: "Cycling",
    //    type: HobbyType.ACTIVE,
    //    place: HobbyPlace.OUTDOORS,
    //    attempts: 2,
    //    attemptDuration: 25,
    //    userHobbies: [userHobby2],
    //    routes: [route1],
    //  }),
    //);
  }
}
=======
      const userHobby1 = new UserHobby();
      userHobby1.status = UserHobbyStatus.ATTEMPTED;
      userHobby1.rating = 7;
      userHobby1.user = adminUserCreated;
      await AppDataSource.manager.save(userHobby1);
      const userHobby2 = new UserHobby();
      userHobby2.status = UserHobbyStatus.REJECTED;
      userHobby2.rating = 0;
      userHobby2.user = otherUserCreated;
      await AppDataSource.manager.save(userHobby2);
      const userHobby3 = new UserHobby();
      userHobby3.status = UserHobbyStatus.REJECTED;
      userHobby3.rating = 0;
      userHobby3.user = otherUserCreated;
      await AppDataSource.manager.save(userHobby3);
      const userHobby4 = new UserHobby();
      userHobby4.status = UserHobbyStatus.REJECTED;
      userHobby4.rating = 0;
      userHobby4.user = otherUserCreated;
      await AppDataSource.manager.save(userHobby4);

      const route1 = new Route();
      route1.name = "Cycling in the park";
      route1.rating = 6;
      route1.distance = 1;
      route1.travellingMethod = TravellingMethod.CYCLING;
      await AppDataSource.manager.save(route1);

      const hobby1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Hobby, {
          name: "Cooking",
          type: HobbyType.PASSIVE,
          place: HobbyPlace.INDOORS,
          attempts: 1,
          attemptDuration: 10,
          userHobbies: [userHobby1],
          routes: [],
        })
      );

      const hobby2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Hobby, {
          name: "Cycling",
          type: HobbyType.ACTIVE,
          place: HobbyPlace.OUTDOORS,
          attempts: 2,
          attemptDuration: 25,
          userHobbies: [userHobby2],
          routes: [route1],
        })
      );

      const hobby3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Hobby, {
          name: "Calisthenics",
          type: HobbyType.ACTIVE,
          place: HobbyPlace.OUTDOORS,
          attempts: 2,
          attemptDuration: 25,
          userHobbies: [userHobby3],
          routes: [route1],
        })
      );

      const hobby4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Hobby, {
          name: "Flying",
          type: HobbyType.ACTIVE,
          place: HobbyPlace.OUTDOORS,
          attempts: 2,
          attemptDuration: 25,
          userHobbies: [userHobby4],
          routes: [route1],
        })
      );

      const hobbyCategory1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(HobbyCategory, {
          name: "Category 1",
          hobbies: [hobby1, hobby3],
        })
      );

      const hobbyCategory2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(HobbyCategory, {
          name: "Category 2",
          hobbies: [hobby2, hobby4],
        })
      );
    }

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/hobbies to see results"
    );
  })
  .catch((error) => console.log(error));
>>>>>>> 4aa94b4c173056b8870cea49824bd3d4630e7d6a
