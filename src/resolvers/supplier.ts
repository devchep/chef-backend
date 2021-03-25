import { Supplier } from "../entities/Supplier";
import { GraphqlContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { SESSION_COOKIE_NAME } from "../constants";
import { isAuth } from "../middleware/isAuth";
import { Order } from "../entities/Order";

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
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError;

  @Field(() => Supplier, { nullable: true })
  supplier?: Supplier;
}

@Resolver()
export class SupplierResolver {
  @Query(() => Supplier, { nullable: true })
  me(@Ctx() { req }: GraphqlContext) {
    if (!req.session.userId) {
      return null;
    }
    return Supplier.findOne(req.session.userId);
  }

  @Mutation(() => SupplierResponse)
  async register(
    @Arg("options") options: SupplierLoginInfo
  ): Promise<SupplierResponse> {
    if (options.userEmail.length <= 3) {
      return {
        errors: {
          field: "email",
          message: "Длина адреса эл. почты не может быть меньше 3-х символов",
        },
      };
    }
    if (options.password.length <= 6) {
      return {
        errors: {
          field: "password",
          message: "Длина пароля не может быть меньше 6-ти символов",
        },
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    let supplier;
    try {
      supplier = await Supplier.create({
        userEmail: options.userEmail,
        password: hashedPassword,
      }).save();
    } catch (err) {
      console.log(err);
      // duplicate email error
      if (err.code === "23505") {
        return {
          errors: {
            field: "email",
            message: "Введенный адрес эл. почты уже зарегистрирован",
          },
        };
      }
    }
    return { supplier };
  }

  @Mutation(() => SupplierResponse)
  async login(
    @Arg("options") options: SupplierLoginInfo,
    @Ctx() { req }: GraphqlContext
  ): Promise<SupplierResponse> {
    const supplier = await Supplier.findOne({
      where: { userEmail: options.userEmail },
    });
    if (!supplier) {
      return {
        errors: {
          field: "email",
          message: "Не найдено пользователей с введенным адресом эл. почты",
        },
      };
    }

    const validPassword = await argon2.verify(
      supplier.password,
      options.password
    );
    if (!validPassword) {
      return {
        errors: {
          field: "password",
          message: "Неверный пароль",
        },
      };
    }

    req.session.userId = supplier.id;
    console.log(req.session.cookie)

    return { supplier };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  logout(@Ctx() { req, res }: GraphqlContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie(SESSION_COOKIE_NAME);
        resolve(true);
      })
    );
  }
}
