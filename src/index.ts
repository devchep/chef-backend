import "reflect-metadata";
import { createConnection } from "typeorm";
import { SESSION_COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "./resolvers/product";
import { SupplierResolver } from "./resolvers/supplier";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { GraphqlContext } from "./types";
import cors from "cors";
import { Supplier } from "./entities/Supplier";
import { Product } from "./entities/Product";
import { ActiveCategory } from "./entities/ActiveCategory";
import { Category } from "./entities/Category";
import { ActiveCategoryResolver } from "./resolvers/activeCategoryResolver";
import { CategoryResolver } from "./resolvers/category";

const main = async () => {
  const conn = createConnection({
    type: "postgres",
    database: "chefapp",
    username: "chefuser",
    password: "3six14mapariaH",
    logging: true,
    synchronize: true,
    entities: [Supplier, Product, Category, ActiveCategory],
  });

  console.log(conn);
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: SESSION_COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax", // csrf protec
        secure: __prod__, // cookie works only in https
      },
      saveUninitialized: false,
      secret: "iojnONiebhibiBi090328njbhf",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ProductResolver, SupplierResolver, CategoryResolver, ActiveCategoryResolver],
      validate: false,
    }),
    context: ({ res, req }): GraphqlContext => ({ res, req }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  // const product = orm.em.create(Product, {
  //   name: "Креветки",
  //   price: 830.99,
  //   measure: "кг",
  //   isActive: true,
  // });
  // await orm.em.persistAndFlush(product);

  app.listen(4200, () => {
    console.log("server started on localhost:4200");
  });
};

main().catch((err) => {
  console.error(err);
});
