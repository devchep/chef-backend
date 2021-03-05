import { Subcategory } from "../entities/Subcategory";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";

@InputType()
class SubcategoryInput {
  @Field()
  name: string;
  @Field()
  categoryId: number;
}

@Resolver()
export class SubcategoryResolver {
  @Query(() => [Subcategory])
  async subcategories(): Promise<Subcategory[]> {
    return Subcategory.find();
  }

  @Mutation(() => Subcategory)
  async createSubategory(@Arg("input") input: SubcategoryInput) {
    return await Subcategory.create(input).save();
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
