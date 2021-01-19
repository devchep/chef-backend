import { Supplier } from "../entities/Supplier";
import { GraphqlContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class SupplierLoginInfo {
  @Field()
  userEmail: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class SupplierResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: [FieldError];

  @Field(() => Supplier, { nullable: true })
  supplier?: Supplier;
}

@Resolver()
export class SupplierResolver {
  @Query(() => Supplier, { nullable: true })
  async me(@Ctx() { em, req }: GraphqlContext) {
    if (!req.session.userId) {
      return null;
    }

    const supplier = await em.findOne(Supplier, { id: req.session.userId });
    return supplier;
  }

  @Mutation(() => SupplierResponse)
  async register(
    @Arg("options") options: SupplierLoginInfo,
    @Ctx() { em }: GraphqlContext
  ): Promise<SupplierResponse> {
    if (options.userEmail.length <= 3) {
      return {
        errors: [
          {
            field: "email",
            message: "Длина адреса эл. почты не может быть меньше 3-х символов",
          },
        ],
      };
    }
    if (options.password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Длина пароля не может быть меньше 6-ти символов",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const supplier = em.create(Supplier, {
      userEmail: options.userEmail,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(supplier);
    } catch (err) {
      // duplicate email error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "Введенный адрес эл. почты уже зарегистрирован",
            },
          ],
        };
      }
    }
    return { supplier };
  }

  @Mutation(() => SupplierResponse)
  async login(
    @Arg("options") options: SupplierLoginInfo,
    @Ctx() { em, req }: GraphqlContext
  ): Promise<SupplierResponse> {
    const supplier = await em.findOne(Supplier, {
      userEmail: options.userEmail,
    });
    if (!supplier) {
      return {
        errors: [
          {
            field: "email",
            message: "Не найдено пользователей с введенным адресом эл. почты",
          },
        ],
      };
    }

    const validPassword = await argon2.verify(
      supplier.password,
      options.password
    );
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Неверный пароль",
          },
        ],
      };
    }

    req.session.userId = supplier.id;

    return { supplier };
  }
}
