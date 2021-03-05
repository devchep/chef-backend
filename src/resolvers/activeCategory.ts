import { ActiveCategory } from "../entities/ActiveCategory";
import { Category } from "../entities/Category";
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
import { Supplier } from "../entities/Supplier";

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

  @Query(() => [Category], { nullable: true })
  @UseMiddleware(isAuth)
  async getActiveCategories(
    @Ctx() { req }: GraphqlContext
  ): Promise<Category[] | null> {
    const supplier = await Supplier.findOne(req.session.userId);
    if (supplier) {
      return supplier.activeCategories;
    }
    return null;
  }
}
