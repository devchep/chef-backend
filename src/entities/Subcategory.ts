import { Field, ID, Int, ObjectType } from "type-graphql";
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
import { Category } from "./Category";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Subcategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => ActiveSubcategory, (activeCategory) => activeCategory.subcategory)
  activeSubcategories: Promise<ActiveSubcategory[]>;

  @Field(() => Int)
  @Column()
  categoryId!: number;
  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (products) => products.subcategory)
  products: Product[];

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
