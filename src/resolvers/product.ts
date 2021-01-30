import { Product } from "../entities/Product";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { GraphqlContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

@InputType()
class CreateProductInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  price: number;
  @Field()
  measure: string;
  @Field(() => Int)
  amount: number;
  @Field()
  isActive: boolean;
}

@InputType()
class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  price?: number;
  @Field({ nullable: true })
  measure?: string;
  @Field({ nullable: true })
  amount?: number;
  @Field({ nullable: true })
  isActive?: boolean;
}

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  @UseMiddleware(isAuth)
  async products(): Promise<Product[]> {
    return Product.find();
  }

  @Query(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  product(@Arg("id") id: number): Promise<Product | undefined> {
    return Product.findOne(id);
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() { req }: GraphqlContext
  ): Promise<Product> {
    return Product.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async updateProduct(
    @Arg("id") id: number,
    @Arg("input") input: UpdateProductInput
  ): Promise<Product | null> {
    const product = await Product.findOne(id);
    if (!product) {
      return null;
    }
    console.log(input);
    Object.assign(product, input);
    return product.save();
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id") id: number): Promise<Boolean> {
    await Product.delete(id);
    return true;
  }
}
