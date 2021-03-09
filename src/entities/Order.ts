import { Field, Float, ID, Int, ObjectType } from "type-graphql";
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
import { OrderProduct } from "./OrderProduct";
import { Product } from "./Product";
import { Supplier } from "./Supplier";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  //   @Field(() => Int)
  //   @Column()
  //   orderNumber!: number;

  @Field(() => Int)
  @Column()
  supplierId!: number;
  @ManyToOne(() => Supplier, (supplier) => supplier.orders)
  @JoinColumn({ name: "supplierId" })
  supplier: Supplier;

  @Field(() => String)
  @Column()
  restaurantName!: string;

  @Field(() => String)
  @Column()
  shippingAdress!: string;

  @Field(() => String)
  @Column()
  phoneNumber!: string;

  @Field(() => Float)
  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  summary: number;

  @Field(() => Int)
  @Column({ default: 0 })
  status!: number;

  @Field(() => [OrderProduct], { nullable: true })
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts!: Promise<OrderProduct[]>;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  deliveryDate: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
