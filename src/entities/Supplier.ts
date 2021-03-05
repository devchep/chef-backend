import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ActiveSubcategory } from "./ActiveSubcategory";
import { Category } from "./Category";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Supplier extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Product, (products) => products.creator)
  products: Product[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: "active_category",
    joinColumn: {
      name: "supplierId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
  })
  @Field(() => [Category])
  activeCategories: Promise<Category[]>;

  @OneToMany(() => ActiveSubcategory, (activeSubcategory) => activeSubcategory.supplier)
  activeSubcategories: ActiveSubcategory[];

  @Field()
  @Column({ unique: true })
  userEmail!: string;

  @Column()
  password!: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
