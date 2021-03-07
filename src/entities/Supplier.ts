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
import { ActiveSubcategory } from "./ActiveSubcategory";
import { Category } from "./Category";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Supplier extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Category], {nullable: true})
  @OneToMany(() => ActiveCategory, (activeCategory) => activeCategory.supplier)
  activeCategories: Promise<ActiveCategory[]>;
  
  @Field(() => [ActiveSubcategory], {nullable: true})
  @OneToMany(() => ActiveSubcategory, (activeSubcategory) => activeSubcategory.supplier)
  activeSubcategories: Promise<ActiveSubcategory[]>;
  
  @OneToMany(() => Product, (products) => products.creator)
  products: Product[];

  @Field()
  @Column({ unique: true })
  userEmail!: string;

  @Column()
  INN: string;

  @Column()
  OGRN: string;

  @Column()
  docimine: string;

  @Column()
  password!: string;

  @Column()
  decimial: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
