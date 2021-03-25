import { Field, ID, Int, ObjectType } from "type-graphql";
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
import { Order } from "./Order";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Supplier extends BaseEntity {
  @Field(() => Int)
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

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.supplier)
  orders!: Promise<Order[]>;

  @Field()
  @Column({ unique: true })
  userEmail!: string;

  @Field({nullable: true})
  @Column({nullable: true})
  INN: string;

  @Field({nullable: true})
  @Column({nullable: true})
  OGRN: string;

  @Field({nullable: true})
  @Column({nullable: true})
  docimine: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
