import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class HobbyRecommendationCoefficient {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  field: string;

  @Column()
  operation: string;

  @Column({ type: "decimal" })
  number: number;
}
