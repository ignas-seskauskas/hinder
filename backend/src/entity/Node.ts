import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Route } from "./Route"

@Entity()
export class Node {

    @PrimaryGeneratedColumn({type: "bigint" })
    id: number

    @Column({type: "float"})
    coordX: number

    @Column({type: "float"})
    coordY: number

    @ManyToOne(() => Route, (route: Route) => route.nodes)
    route: Route
}
