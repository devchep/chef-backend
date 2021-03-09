import { Product } from "../entities/Product";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { Order } from "../entities/Order";
import { OrderProduct } from "../entities/OrderProduct";

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
  //   @Query(() => [Product])
  //   @UseMiddleware(isAuth)
  //   async products(@Ctx() { req }: GraphqlContext): Promise<Product[]> {
  //     return Product.find({ where: { creatorId: req.session.userId } });
  //   }

  //   @Query(() => Product, { nullable: true })
  //   @UseMiddleware(isAuth)
  //   product(
  //     @Arg("id") id: number,
  //     @Ctx() { req }: GraphqlContext
  //   ): Promise<Product | undefined> {
  //     return Product.findOne({ id, creatorId: req.session.userId });
  //   }

  @Mutation(() => OrderResponse)
  async makeOrder(@Arg("input") input: MakeOrderInput): Promise<OrderResponse> {
    let summary = 0;
    const order = await Order.create({
      supplierId: input.supplierId,
      restaurantName: input.restaurant.name,
      shippingAdress: input.restaurant.shippingAdress,
      phoneNumber: input.restaurant.phoneNumber,
    }).save();
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

  //   @Mutation(() => Product, { nullable: true })
  //   @UseMiddleware(isAuth)
  //   async updateProduct(
  //     @Arg("id") id: number,
  //     @Arg("input") input: UpdateProductInput,
  //     @Ctx() { req }: GraphqlContext
  //   ): Promise<Product | null> {
  //     const product = await Product.findOne({
  //       id,
  //       creatorId: req.session.userId,
  //     });
  //     if (!product) {
  //       return null;
  //     }
  //     Object.assign(product, input);
  //     return product.save();
  //   }

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
