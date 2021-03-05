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
import { Subcategory } from "./Subcategory";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Supplier)
  @JoinTable({
    name: "active_category",
    joinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "supplierId",
      referencedColumnName: "id",
    },
  })
  activeSuppliers: Promise<Supplier[]>;

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
