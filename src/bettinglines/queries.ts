import {  BettingLine, Bet } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type GetBettingLines, type GetAllBettingLines } from "wasp/server/operations";

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

export type BetWithLineAndUser = BettingLine & { bets: Bet[] };

export const getAllBettingLines: GetAllBettingLines<void, BetWithLineAndUser[]> = async (_, context) => {
if (!context.user) {
    throw new HttpError(401);
  }

  const statusOrder = { "open": 1, "closed": 2, "complete": 3 };
  
  const bettingLines = await context.entities.BettingLine.findMany({
    include: {
      bets: {}
    }
  });

  return bettingLines.sort((a, b) => 
    {if (a.status !== "open" && a.status !== "closed" && a.status !== "complete") return -1
      if (b.status !== "open" && b.status !== "closed" && b.status !== "complete") return -1
    return statusOrder[a.status] - statusOrder[b.status]
    }
  );
 
};