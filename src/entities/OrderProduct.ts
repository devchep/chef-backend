import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  orderId!: number;
  @ManyToOne(() => Order, (order) => order.orderProducts, {onDelete:'CASCADE'})
  @JoinColumn({ name: "orderId" })
  order: Promise<Order>
  
  @Column()
  productId!: number;
  //   @Field(() => [Product], { nullable: true })
  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.orderProducts, {onDelete:'CASCADE'})
  @JoinColumn({ name: "productId" })
  product: Promise<Product>;

  @Column()
  productsAmount: number

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}