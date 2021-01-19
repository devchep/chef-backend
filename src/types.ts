import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

export type GraphqlContext = {
  res: Response;
  req: Request & {session: Session & Partial<SessionData> & { userId?: number }};
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
