import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ProductResolver } from "./resolvers/product";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ProductResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
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

main();
