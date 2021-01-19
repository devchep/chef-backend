import { Product } from "../entities/Product";
import { GraphqlContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  products(@Ctx() { em }: GraphqlContext): Promise<Product[]> {
    return em.find(Product, {});
  }

  @Query(() => Product, { nullable: true })
  product(
    @Arg("id") id: number,
    @Ctx() { em }: GraphqlContext
  ): Promise<Product | null> {
    return em.findOne(Product, { id });
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("name") name: string,
    @Arg("price") price: number,
    @Arg("measure") measure: string,
    @Arg("isActive") isActive: boolean,
    @Ctx() { em }: GraphqlContext
  ): Promise<Product> {
    const product = em.create(Product, { name, price, measure, isActive });
    await em.persistAndFlush(product);
    return product;
  }

  @Mutation(() => Product)
  async updateProduct(
    @Arg("id") id: number,
    @Arg("name", { nullable: true }) name: string,
    @Arg("price", { nullable: true }) price: number,
    @Arg("measure", { nullable: true }) measure: string,
    @Arg("isActive", { nullable: true }) isActive: boolean,
    @Ctx() { em }: GraphqlContext
  ): Promise<Product | null> {
    const product = await em.findOne(Product, { id });
    if (!product) {
      return null;
    }
    console.log(price, measure, isActive)
    if (typeof name !== "undefined" && name !== "") {
      product.name = name;
      await em.persistAndFlush(product);
    }
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Arg("id") id: number,
    @Ctx() { em }: GraphqlContext
  ): Promise<Boolean> {
    await em.nativeDelete(Product, { id });
    return true;
  }
}
