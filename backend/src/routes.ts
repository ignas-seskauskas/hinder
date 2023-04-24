import { HobbyController } from "./controller/HobbyController"

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
}]
