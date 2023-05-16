import { HobbyController } from "./controller/HobbyController"
import { RouteController } from "./controller/RouteController"

export const Routes = [{
    method: "get",
    route: "/hobbies",
    controller: HobbyController,
    action: "all"
}, {
    method: "get",
    route: "/hobbies/:id",
    controller: HobbyController,
    action: "one"
}, {
    method: "post",
    route: "/hobbies",
    controller: HobbyController,
    action: "save"
}, {
    method: "delete",
    route: "/hobbies/:id",
    controller: HobbyController,
    action: "remove"
}, {
    method: "get",
    route: "/routes",
    controller: RouteController,
    action: "all"
}, {
    method: "get",
    route: "/routes/:id",
    controller: RouteController,
    action: "one"
}, {
    method: "post",
    route: "/routes",
    controller: RouteController,
    action: "save"
}]
