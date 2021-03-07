import { Subcategory } from "../entities/Subcategory";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

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
  async subcategories(
    @Arg("categoryId") categoryId: number
  ): Promise<Subcategory[]> {
    return Subcategory.find({ where: { categoryId }, relations: ["products"] });
  }

  @Mutation(() => Subcategory)
  async createSubcategory(@Arg("input") input: SubcategoryInput) {
    return await Subcategory.create(input).save();
  }

  @Mutation(() => Boolean)
  async deleteSubcategory(@Arg("id") id: number): Promise<Boolean> {
    const result = await Subcategory.delete({ id });
    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
