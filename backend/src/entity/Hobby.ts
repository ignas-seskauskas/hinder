import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Route } from "./Route"
import { UserHobby } from "./UserHobby"

export enum HobbyType {
    PASSIVE = 'Passive',
    ACTIVE = 'Active',
}

export enum HobbyPlace {
    INDOORS = 'Indoors',
    OUTDOORS = 'Outdoors',
}

@Entity()
export class Hobby {

    @PrimaryGeneratedColumn({type: "bigint" })
    id: number

    @Column()
    name: string

    @Column({type: 'enum', enum: HobbyType})
    type: HobbyType

    @Column({type: 'enum', enum: HobbyPlace})
    place: HobbyPlace

    @Column()
    attempts: number

    @Column()
    attemptDuration: number

    @OneToMany(() => UserHobby, (userHobby) => userHobby.hobby, {nullable: true})
    userHobbies: UserHobby[]

    @OneToMany(() => Route, (route) => route.hobby, { nullable: true })
    routes: Route[]
}
