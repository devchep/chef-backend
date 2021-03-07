import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";

@InputType()
class CategoryInput {
  @Field()
  name: string;
}

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return Category.find({ relations: ["subcategories"] });
  }

  @Mutation(() => Category)
  async createCategory(@Arg("input") input: CategoryInput) {
    return await Category.create(input).save();
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("id") id: number): Promise<Boolean> {
    const result = await Category.delete({ id });
    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
