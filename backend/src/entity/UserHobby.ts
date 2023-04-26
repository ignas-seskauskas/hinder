import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hobby } from "./Hobby";

enum UserHobbyStatus {
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

  //@ManyToOne(() => Hobby, (hobby) => hobby.id)
  //hobby: Hobby;
}
