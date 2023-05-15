import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Route } from "./Route";
import { UserHobby } from "./UserHobby";
import { Hobby } from "./Hobby";

@Entity()
export class HobbyCategory {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Hobby, (hobby) => hobby.category, {
    nullable: true,
  })
  hobbies: Hobby[];
}
