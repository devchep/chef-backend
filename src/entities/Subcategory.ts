import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ActiveSubcategory } from "./ActiveSubcategory";
import { Category } from "./Category";

@ObjectType()
@Entity()
export class Subcategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @ManyToOne(() => ActiveSubcategory, (activeSubcategory) => activeSubcategory.subcategory)
  activeSubcategory: ActiveSubcategory[];

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
