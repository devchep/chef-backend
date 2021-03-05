import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { Subcategory } from "./Subcategory";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class ActiveSubcategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Boolean)
  @Column({default: true})
  isActive!: boolean;

  @PrimaryColumn()
  supplierId!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.activeSubcategories)
  supplier: Supplier;

  @Field(() => Int)
  @PrimaryColumn()
  subcategoryId!: number;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.activeSubcategory)
  subcategory: Subcategory

  @Field(() => [Product])
  @OneToMany(() => Product, (products) => products.activeSubcategory)
  products: Product[];
}
