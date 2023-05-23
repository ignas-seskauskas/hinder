import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hobby } from "./Hobby";
import { User } from "./User";

export enum UserHobbyStatus {
  REJECTED = "Rejected",
  ACTIVE = "Active",
  ATTEMPTED = "Attempted",
  RECOMMENDED = "Recommended",
}

@Entity()
export class UserHobby {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: UserHobbyStatus })
  status: UserHobbyStatus;

  @Column()
  rating: number;

  @ManyToOne(() => Hobby, (hobby) => hobby.userHobbies)
  hobby: Hobby;

  @ManyToOne(() => User, (user) => user.userHobbies)
  user: User;
}
