import { ActiveCategory } from "../entities/ActiveCategory";
import { Category } from "../entities/Category";
import { Arg, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class ActiveCategoryResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addActiveCategory(
    @Arg("supplierId", () => Int) supplierId: number,
    @Arg("categoryId", () => Int) categoryId: number
  ) {
    await ActiveCategory.create({ supplierId, categoryId }).save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteActiveCategory(@Arg("categoryId", () => Int) categoryId: number) {
    await ActiveCategory.delete({ categoryId });
    return true;
  }

  @Mutation(() => [Category])
  @UseMiddleware(isAuth)
  async getActiveCategories(@Arg("supplierId", () => Int) supplierId: number) {
    return await ActiveCategory.find({ where: { supplierId } });
  }
}
