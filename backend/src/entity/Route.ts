import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Hobby } from "./Hobby"

enum TravellingMethod {
    WALKING = 'Walking',
    CYCLING = 'Cycling',
    DRIVING = 'Driving',
}

@Entity()
export class Route {

    @PrimaryGeneratedColumn({type: "bigint" })
    id: number

    @Column()
    name: string

    @Column({type: "float"})
    distance: number

    @Column({type: 'enum', enum: TravellingMethod})
    travellingMethod: TravellingMethod

    @Column()
    rating: number

    //@ManyToOne(() => Hobby, (hobby) => hobby.routes)
    //hobby: Hobby
}
