import { ActiveCategory } from "../entities/ActiveCategory";
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

@Resolver()
export class ActiveCategoryResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addActiveCategory(
    @Arg("categoryId", () => Int) categoryId: number,
    @Ctx() { req }: GraphqlContext
  ) {
    await ActiveCategory.create({
      categoryId,
      supplierId: req.session.userId,
    }).save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteActiveCategory(
    @Arg("categoryId", () => Int) categoryId: number,
    @Ctx() { req }: GraphqlContext
  ) {
    await ActiveCategory.delete({ categoryId, supplierId: req.session.userId });
    return true;
  }

  @Query(() => [ActiveCategory], { nullable: true })
  @UseMiddleware(isAuth)
  async getActiveCategories(
    @Ctx() { req }: GraphqlContext
  ): Promise<ActiveCategory[] | null> {
    const activeCategories = await ActiveCategory.find({
      where: {supplierId: req.session.userId},
      relations: ["category", "activeSubcategories", "activeSubcategories.subcategory", "activeSubcategories.products"],
    });
    if (activeCategories) {
      return activeCategories;
    }
    return null;
  }
}
