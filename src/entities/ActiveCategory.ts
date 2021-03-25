import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ActiveSubcategory } from "./ActiveSubcategory";
import { Category } from "./Category";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class ActiveCategory extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplierId!: number;
  @ManyToOne(() => Supplier, (supplier) => supplier.activeCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "supplierId" })
  supplier: Promise<Supplier>;

  @Column()
  categoryId!: number;
  @Field(() => Category)
  @JoinColumn({ name: "categoryId" })
  @ManyToOne(() => Category, (category) => category.activeCategories, {
    onDelete: "CASCADE",
  })
  category: Category;

  @Field(() => [ActiveSubcategory], { nullable: true })
  @OneToMany(
    () => ActiveSubcategory,
    (activeSubcategory) => activeSubcategory.activeCategory
  )
  activeSubcategories: ActiveSubcategory[];

  @Field(() => Boolean)
  @Column({ default: true })
  isShown!: boolean;
}
