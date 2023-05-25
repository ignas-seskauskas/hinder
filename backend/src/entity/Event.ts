import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
  } from "typeorm";
import { User } from "./User";
  
  
  @Entity()
  export class Event {
    @PrimaryColumn()
    id: string;
  
    @Column()
    name: string;
  
    @Column({ type: "datetime" })
    start: Date;

    @Column({ type: "datetime" })
    end: Date;
  
    @ManyToOne(() => User, (creator) => creator.events)
    creator: User;
  }