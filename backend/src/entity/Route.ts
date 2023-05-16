import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Hobby } from "./Hobby";
import { Node } from "./Node";

export enum TravellingMethod {
  Walk = "walk",
  Bicycle = "bicycle",
  Drive = "drive",
}

@Entity()
export class Route {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  name: string;

  @Column({ type: "float" })
  distance: number;

  @Column({ type: "enum", enum: TravellingMethod })
  travellingMethod: TravellingMethod;

  @Column()
  rating: number;

  @ManyToOne(() => Hobby, (hobby) => hobby.routes)
  hobby: Hobby;

  @OneToMany(() => Node, (node) => node.route, { nullable: true })
  nodes: Node[];
}
