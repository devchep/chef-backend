import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ActiveSubcategory } from "./ActiveSubcategory";
import { OrderProduct } from "./OrderProduct";
import { Subcategory } from "./Subcategory";
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

  @Field(() => Int)
  @Column()
  subcategoryId!: number;
  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products)
  @JoinColumn({ name: "subcategoryId" })
  subcategory: Subcategory;

  @Column()
  activeSubcategoryId!: number
  @ManyToOne(
    () => ActiveSubcategory,
    (activeSubcategory) => activeSubcategory.products
  )
  @JoinColumn({ name: "activeSubcategoryId" })
  activeSubcategory: ActiveSubcategory;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => Float)
  @Column("decimal", { precision: 9, scale: 2 })
  price!: number;

  @Field(() => String)
  @Column()
  measure!: string;

  @Field(() => Int)
  @Column()
  amount: number;

  @Field(() => Boolean)
  @Column({ default: true })
  isShown!: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
