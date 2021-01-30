import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

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
  @Field(() => [Supplier])
  activeSuppliers: Promise<Supplier[]>;

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @Column({default: true})
  isActive!: boolean;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
