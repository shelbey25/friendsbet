import {  BettingLine } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type GetBettingLines } from "wasp/server/operations";

export const getBettingLines: GetBettingLines<void, BettingLine[]> = (_, context) => {
if (!context.user) {
    throw new HttpError(401);
  }
  
  return context.entities.BettingLine.findMany({
    where: {
      status: "open",
    },
  });
};

export const getUnfinalizedBettingLines: GetBettingLines<void, BettingLine[]> = (_, context) => {
if (!context.user) {
    throw new HttpError(401);
  }
  
  return context.entities.BettingLine.findMany({
    where: {
      status: {
        in: ["open", "closed"]
      },
    },
  });
};