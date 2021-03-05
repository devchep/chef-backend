import { Field, Float, ID, Int, ObjectType } from "type-graphql";
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
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  creatorId!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  creator: Supplier;

  @Field(() => String)
  @Column()
  subcategoryId!: number;

  @ManyToOne(() => ActiveSubcategory, (activeSubcategory) => activeSubcategory.products)
  activeSubcategory: ActiveSubcategory;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => Float)
  @Column("float")
  price!: number;

  @Field(() => String)
  @Column()
  measure!: string;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field(() => Boolean)
  @Column()
  isActive!: boolean;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
