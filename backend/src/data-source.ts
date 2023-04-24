import "reflect-metadata"
import { DataSource } from "typeorm"
import { Hobby } from "./entity/Hobby"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "hinder",
    synchronize: true,
    logging: false,
    entities: [Hobby],
    migrations: [],
    subscribers: [],
})
