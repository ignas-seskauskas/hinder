import { HobbyController } from "./controller/HobbyController";
import { RouteController } from "./controller/RouteController";
import { HobbyRecommendationCoefficientController } from "./controller/HobbyRecommendationCoefficientController";
import { UserController } from "./controller/UserController";

export const Routes = [
  {
    method: "get",
    route: "/hobbies",
    controller: HobbyController,
    action: "all",
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
    action: "save",
  },
  {
    method: "delete",
    route: "/hobbies/:id",
    controller: HobbyController,
    action: "remove",
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
    method: "post",
    route: "/routes",
    controller: RouteController,
    action: "save",
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
];
