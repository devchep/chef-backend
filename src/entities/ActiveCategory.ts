import { ObjectType } from "type-graphql";
import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class ActiveCategory extends BaseEntity {
  @PrimaryColumn()
  supplierId: number;

  @PrimaryColumn()
  categoryId: number;
}
