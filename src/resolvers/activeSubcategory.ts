import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { GraphqlContext } from "src/types";
import { ActiveSubcategory } from "../entities/ActiveSubcategory";

@Resolver()
export class ActiveSubcategoryResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addActiveSubcategory(
    @Arg("subcategoryId", () => Int) subcategoryId: number,
    @Arg("activeCategoryId", () => Int) activeCategoryId: number,
    @Ctx() { req }: GraphqlContext
  ) {
    await ActiveSubcategory.create({
      subcategoryId,
      activeCategoryId,
      supplierId: req.session.userId,
    }).save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteActiveSubcategory(
    @Arg("subcategoryId", () => Int) subcategoryId: number,
    @Ctx() { req }: GraphqlContext
  ) {
    await ActiveSubcategory.delete({
      subcategoryId,
      supplierId: req.session.userId,
    });
    return true;
  }

  @Query(() => [ActiveSubcategory], { nullable: true })
  @UseMiddleware(isAuth)
  async getActiveSubcategories(
    @Arg("activeCategoryId", () => Int) activeCategoryId: number,
    @Ctx() { req }: GraphqlContext
  ): Promise<ActiveSubcategory[] | null> {
    const activeSubcategory = await ActiveSubcategory.find({
      where: {
        activeCategoryId,
        supplierId: req.session.userId,
      },
      relations: ["subcategory", "products"],
    });
    if (activeSubcategory.length !== 0) {
      return activeSubcategory;
    }
    return null;
  }

  // TODO:
  // @Query(() => [Product], { nullable: true })
  // @UseMiddleware(isAuth)
  // async getSubcategoryProducts(
  //   @Arg("subcategoryId", () => Int) subcategoryId: number,
  //   @Ctx() { req }: GraphqlContext
  // ): Promise<Product[] | null> {
  //   const activeSubcategory = await ActiveSubcategory.findOne({
  //     supplierId: req.session.userId,
  //     subcategoryId,
  //   });
  //   console.log(activeSubcategory?.subcategory);
  //   if (activeSubcategory) {
  //     return activeSubcategory.products;
  //   }
  //   return null;
  // }
}
