import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";

@ObjectType()
@Entity()
export class ActiveCategory extends BaseEntity {
  @PrimaryColumn()
  supplierId!: number;

  @PrimaryColumn()
  categoryId!: number;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive!: boolean;
}
