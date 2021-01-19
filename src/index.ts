import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "./resolvers/product";
import { SupplierResolver } from "./resolvers/supplier";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { GraphqlContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "sid",
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
      resolvers: [ProductResolver, SupplierResolver],
      validate: false,
    }),
    context: ({ res, req }): GraphqlContext => ({ em: orm.em, res, req }),
  });

  apolloServer.applyMiddleware({ app });

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
