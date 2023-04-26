import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Hobby {

    @PrimaryGeneratedColumn({type: "bigint" })
    id: number

    @Column()
    name: string

    @Column()
    type: string

    @Column()
    place: string

    @Column()
    attempts: number

    @Column()
    attemptDuration: number
}
