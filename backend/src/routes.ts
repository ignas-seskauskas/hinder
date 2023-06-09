import { HobbyController } from "./controller/HobbyController";
import { RouteController } from "./controller/RouteController";
import { HobbyRecommendationCoefficientController } from "./controller/HobbyRecommendationCoefficientController";
import { UserController } from "./controller/UserController";
import { EventController } from "./controller/EventController";
import { MicrosoftGraphAPI } from "./boundary/MicrosoftGraphAPI";

export const Routes = [
  {
    method: "get",
    route: "/hobbies",
    controller: HobbyController,
    action: "get",
  },
  {
    method: "get",
    route: "/hobbies/:id",
    controller: HobbyController,
    action: "one",
  },
  {
    method: "post",
    route: "/hobbies",
    controller: HobbyController,
    action: "create",
  },
  {
    method: "post",
    route: "/hobbies/update",
    controller: HobbyController,
    action: "update",
  },
  {
    method: "delete",
    route: "/hobbies/:id",
    controller: HobbyController,
    action: "delete",
  },
  {
    method: "get",
    route: "/routes",
    controller: RouteController,
    action: "all",
  },
  {
    method: "get",
    route: "/routes/:id",
    controller: RouteController,
    action: "one",
  },
  {
    method: "put",
    route: "/routes",
    controller: RouteController,
    action: "update",
  },
  {
    method: "post",
    route: "/routes",
    controller: RouteController,
    action: "create",
  },
  {
    method: "post",
    route: "/routes/new",
    controller: RouteController,
    action: "submit",
  },
  {
    method: "get",
    route: "/routes/interesting-places/:lng/:lat",
    controller: RouteController,
    action: "getInterestingPlaces",
  },
  {
    method: "post",
    route: "/routes/mapmatching",
    controller: RouteController,
    action: "getRoutes",
  },
  {
    method: "post",
    route: "/routes/generate-new",
    controller: RouteController,
    action: "generateRoute",
  },
  {
    method: "put",
    route: "/hobbyrecommendationcoefficients",
    controller: HobbyRecommendationCoefficientController,
    action: "edit",
  },
  {
    method: "get",
    route: "/hobbyrecommendationcoefficients",
    controller: HobbyRecommendationCoefficientController,
    action: "get",
  },
  {
    method: "post",
    route: "/starthobbyrecommendation",
    controller: HobbyController,
    action: "startHobbyRecommendation",
  },
  {
    method: "post",
    route: "/hobbyaccepted",
    controller: HobbyController,
    action: "hobbyAccepted",
  },
  {
    method: "post",
    route: "/dismisshobby",
    controller: HobbyController,
    action: "dismissHobby",
  },
  {
    method: "post",
    route: "/login",
    controller: UserController,
    action: "loginUser",
  },
  {
    method: "post",
    route: "/register",
    controller: UserController,
    action: "registerUser",
  },
  {
    method: "post",
    route: "/createeventsforhobby",
    controller: EventController,
    action: "createEventsForHobby",
  }
];
