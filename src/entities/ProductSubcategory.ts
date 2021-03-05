import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class ProductSubcategory extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn()
  activeSubcategoryId: number;

  @PrimaryColumn()
  productId: number;
}
