import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ActiveCategory } from "./ActiveCategory";
import { Product } from "./Product";
import { Subcategory } from "./Subcategory";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class ActiveSubcategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplierId!: number;
  @ManyToOne(() => Supplier, (supplier) => supplier.activeSubcategories)
  @JoinColumn({ name: "supplierId" })
  supplier: Promise<Supplier>;

  @Column()
  activeCategoryId!: number;
  @ManyToOne(
    () => ActiveCategory,
    (activeCategory) => activeCategory.activeSubcategories
  )
  @JoinColumn({ name: "activeCategoryId" })
  activeCategory: ActiveCategory;

  @Column()
  subcategoryId!: number;
  @Field(() => Subcategory)
  @ManyToOne(
    () => Subcategory,
    (subcategory) => subcategory.activeSubcategories
  )
  subcategory: Subcategory;

  @Field(() => Boolean)
  @Column({ default: true })
  isShown!: boolean;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (products) => products.activeSubcategory)
  products: Product[];
}
