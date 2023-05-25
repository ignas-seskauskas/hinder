import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { UserHobby } from "./UserHobby";
import { Event } from "./Event";
import { UserFriend } from "./UserFriend";

export enum UserType {
  HobbyFinder,
  Admin,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  nickname: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserType })
  type: UserType;

  @OneToMany(() => UserHobby, (userHobby) => userHobby.hobby, {
    nullable: true,
  })
  userHobbies: UserHobby[];

  @OneToMany(() => UserFriend, (userFriend) => userFriend.searcher)
  initiatedFriendships: UserFriend[];

  @OneToMany(() => UserFriend, (userFriend) => userFriend.friend)
  receivedFriendships: UserFriend[];

  @OneToMany(() => Event, (event) => event.creator)
  events: Event[];
}
