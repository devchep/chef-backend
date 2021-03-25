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
    const activeCategory = await ActiveCategory.findOne({
      categoryId,
      supplierId: req.session.userId,
    });
    if (activeCategory?.isShown === false) {
      activeCategory.isShown = true;
      activeCategory.save();
      return true;
    }
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
    const result = await ActiveCategory.delete({
      categoryId,
      supplierId: req.session.userId,
    });
    if (result.affected === 0) {
      return false;
    }
    return true;
  }

  @Mutation(() => ActiveCategory)
  @UseMiddleware(isAuth)
  async updateActiveCategory(
    @Arg("activeCategoryId", () => Int) activeCategoryId: number,
    @Arg("isShown", () => Boolean) isShown: boolean,
    @Ctx() { req }: GraphqlContext
  ): Promise<ActiveCategory | null> {
    const activeCategory = await ActiveCategory.findOne({
      id: activeCategoryId,
      supplierId: req.session.userId,
    }, {relations: ["category"]});
    if (!activeCategory) {
      return null;
    }
    activeCategory.isShown = isShown;
    return activeCategory.save();
  }

  @Query(() => [ActiveCategory], { nullable: true })
  @UseMiddleware(isAuth)
  async getActiveCategories(
    @Ctx() { req }: GraphqlContext
  ): Promise<ActiveCategory[] | null> {
    const activeCategories = await ActiveCategory.find({
      where: { supplierId: req.session.userId },
      relations: [
        "category",
        "activeSubcategories",
        "activeSubcategories.subcategory",
        "activeSubcategories.products",
      ],
    });
    if (activeCategories.length != 0) {
      return activeCategories;
    }
    return null;
  }

  @Query(() => [ActiveCategory], { nullable: true })
  @UseMiddleware(isAuth)
  async getShownCategories(
    @Ctx() { req }: GraphqlContext
  ): Promise<ActiveCategory[] | null> {
    const activeCategories = await ActiveCategory.find({
      where: { supplierId: req.session.userId, isShown: true },
      relations: [
        "category",
        "activeSubcategories",
        "activeSubcategories.subcategory",
        "activeSubcategories.products",
      ],
    });
    if (activeCategories.length != 0) {
      return activeCategories;
    }
    return null;
  }
}
