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
    return Category.find();
  }

  @Mutation(() => Category)
  async createCategory(@Arg("input") input: CategoryInput) {
    return await Category.create(input).save();
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg("input") input: CategoryInput): Promise<Boolean> {
    const result = await Category.delete({ name: input.name });
    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
