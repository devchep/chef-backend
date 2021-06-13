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
  subcategoryId: number;
  @Field()
  activeSubcategoryId: number;
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
  isShown?: boolean;
}

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  @UseMiddleware(isAuth)
  async products(@Ctx() { req }: GraphqlContext): Promise<Product[]> {
    return Product.find({ where: { creatorId: req.session.userId } });
  }

  @Query(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  product(
    @Arg("id") id: number,
    @Ctx() { req }: GraphqlContext
  ): Promise<Product | undefined> {
    return Product.findOne({ id, creatorId: req.session.userId });
  }

  @Mutation(() => Product)
  @UseMiddleware(isAuth)
  async createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() { req }: GraphqlContext
  ): Promise<Product> {
    return Product.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Product, { nullable: true })
  @UseMiddleware(isAuth)
  async updateProduct(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: UpdateProductInput,
    @Ctx() { req }: GraphqlContext
  ): Promise<Product | null> {
    const product = await Product.findOne({
      id,
      creatorId: req.session.userId,
    });
    if (!product) {
      return null;
    }
    Object.assign(product, input);
    return product.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteProduct(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: GraphqlContext
  ): Promise<Boolean> {
    const result = await Product.delete({ id, creatorId: req.session.userId });
    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
