import { HobbyController } from "./controller/HobbyController";
import { HobbyRecommendationCoefficientController } from "./controller/HobbyRecommendationCoefficientController";

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
];
