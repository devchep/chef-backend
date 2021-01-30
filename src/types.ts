import { Request, Response } from "express";
import { Session, SessionData } from "express-session";

export type GraphqlContext = {
  res: Response;
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
};
