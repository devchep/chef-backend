import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type GraphqlContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
