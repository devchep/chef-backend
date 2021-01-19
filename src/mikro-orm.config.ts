import { __prod__ } from "./constants";
import { Product } from "./entities/Product";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { Supplier } from "./entities/Supplier";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Product, Supplier],
  dbName: "chefapp",
  user: "chefuser",
  password: "3six14mapariaH",
  type: "postgresql",
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
