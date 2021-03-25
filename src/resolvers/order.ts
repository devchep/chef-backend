import { Product } from "../entities/Product";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Order } from "../entities/Order";
import { OrderProduct } from "../entities/OrderProduct";
import { isAuth } from "../middleware/isAuth";
import { GraphqlContext } from "src/types";

@InputType()
class ProductsInput {
  @Field()
  productId: number;
  @Field()
  productAmount: number;
}

@InputType()
class RestaurantInput {
  @Field()
  name: string;
  @Field()
  shippingAdress: string;
  @Field()
  phoneNumber: string;
}

@InputType()
class MakeOrderInput {
  @Field()
  supplierId: number;
  @Field(() => [ProductsInput])
  products: ProductsInput[];
  @Field(() => RestaurantInput)
  restaurant: RestaurantInput;
}

@InputType()
class UpdateOrderInput {
  @Field({ nullable: true })
  status?: number;
  @Field({ nullable: true })
  deliveryDate?: Date;
}

@ObjectType()
class OrderFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class OrderResponse {
  @Field(() => OrderFieldError, { nullable: true })
  errors?: OrderFieldError;

  @Field(() => Order, { nullable: true })
  order?: Order;
}

@Resolver()
export class OrderResolver {
  @Query(() => [Order])
  @UseMiddleware(isAuth)
  async orders(@Ctx() { req }: GraphqlContext): Promise<Order[] | null> {
    const orders = await Order.find({
      where: { supplierId: req.session.userId },
      relations: ["orderProducts"],
    });
    if (orders.length === 0) {
      return null;
    }
    return orders;
  }

  @Mutation(() => OrderResponse)
  async makeOrder(@Arg("input") input: MakeOrderInput): Promise<OrderResponse> {
    let summary = 0;
    let order: Order;
    try {
      order = await Order.create({
        supplierId: input.supplierId,
        restaurantName: input.restaurant.name,
        shippingAdress: input.restaurant.shippingAdress,
        phoneNumber: input.restaurant.phoneNumber,
      }).save();
    } catch (error) {
      return {
        errors: {
          field: "input",
          message:
            "Возникла ошибка при создании заказа. Проверьте входные данные и попробуйте еще раз",
        },
      };
    }

    for (let item of input.products) {
      const product = await Product.findOne(item.productId);
      if (!product) {
        return {
          errors: {
            field: "productId",
            message: `Не существует продукта с указаным ID ${item.productId}`,
          },
        };
      }
      if (product.creatorId !== order.supplierId) {
        return {
          errors: {
            field: "productId",
            message: `Товар с ID ${product.name} не принадлежит поставщику с ID ${order.supplierId}\n Уберите товары, не принадлежащие указаному поставщику`,
          },
        };
      }
      if (product.amount < item.productAmount) {
        return {
          errors: {
            field: "productAmount",
            message: `Товар ${product.name} доступен для заказа в количестве: ${product.amount} ${product.measure} \n Введено: ${item.productAmount}`,
          },
        };
      }
      summary += product.price * item.productAmount;
      await OrderProduct.create({
        orderId: order.id,
        productId: item.productId,
        productsAmount: item.productAmount,
      }).save();
    }

    order.summary = summary;
    return { order: await order.save() };
  }

    @Mutation(() => Order, { nullable: true })
    @UseMiddleware(isAuth)
    async updateProduct(
      @Arg("id") id: number,
      @Arg("input") input: UpdateOrderInput,
      @Ctx() { req }: GraphqlContext
    ): Promise<Order | null> {
      const order = await Order.findOne({
        id,
        supplierId: req.session.userId,
      });
      if (!order) {
        return null;
      }
      Object.assign(order, input);
      return order.save();
    }

  //   @Mutation(() => Boolean)
  //   @UseMiddleware(isAuth)
  //   async deleteProduct(
  //     @Arg("id") id: number,
  //     @Ctx() { req }: GraphqlContext
  //   ): Promise<Boolean> {
  //     const result = await Product.delete({ id, creatorId: req.session.userId });
  //     if (result.affected === 0) {
  //       return false;
  //     }
  //     return true;
  //   }
}
