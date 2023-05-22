import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserFriend {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "date" })
  friendshipStartDate: Date;

  @Column()
  requestSent: boolean;

  @Column()
  requestAccepted: boolean;

  @ManyToOne(() => User, (user) => user.initiatedFriendships)
  searcher: User;

  @ManyToOne(() => User, (user) => user.receivedFriendships)
  friend: User;
}
