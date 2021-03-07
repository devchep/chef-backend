import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ActiveCategory } from "./ActiveCategory";
import { Subcategory } from "./Subcategory";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => ActiveCategory, (activeCategory) => activeCategory.category)
  activeCategories: Promise<Supplier[]>;

  @Field(() => [Subcategory], {nullable: true})
  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
