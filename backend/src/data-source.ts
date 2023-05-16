import "reflect-metadata"
import { DataSource } from "typeorm"
import { Hobby } from "./entity/Hobby"
import { UserHobby } from "./entity/UserHobby"
import { Route } from "./entity/Route"
import { Node } from "./entity/Node"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "hinder",
    synchronize: true,
    logging: false,
    entities: [Hobby, UserHobby, Route, Node],
    migrations: [],
    subscribers: [],
})
