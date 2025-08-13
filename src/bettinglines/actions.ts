import { BettingLine } from "wasp/entities";
import { HttpError } from "wasp/server";
import { UpdateBettingLine, CreateBettingLine, UpdateBettingLineFull } from "wasp/server/operations";

type UpdateBetlineArgs = {
  lineId: string;
  statusUpdate: string;
};

export const updateBettingLine: UpdateBettingLine<UpdateBetlineArgs, BettingLine> = async (
    {lineId, statusUpdate},
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.BettingLine.update({
    where: {
        id: lineId
    },
    data: {
      status: statusUpdate,

    },
  });
};

type CreateBetlineArgs = {
  category: string;
  isMoneyline: boolean;
  event: string;
  date: string;
  team1: string;
  team2: string;
  odds1: number;
  odds2: number;
  total: number;
  overOdds: number;
  underOdds: number;
};

export const createBettingLine: CreateBettingLine<CreateBetlineArgs, BettingLine> = async (
    {category,
  isMoneyline,
  event,
  date,
  team1,
  team2,
  odds1,
  odds2,
  total,
  overOdds,
  underOdds},
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.BettingLine.create({
    data: {
      leagueId: context.user.leagueId,
      isMoneyline,
      category,
      event,
  date,
  team1,
  team2,
  odds1,
  odds2,
  total,
  overOdds,
  underOdds,
      status: "open",

    },
  });
};


type UpdateBettingLineFullArgs = {
  id: string;
  category: string;
  isMoneyline: boolean;
  event: string;
  date: string;
  team1: string;
  team2: string;
  odds1: number;
  odds2: number;
  total: number;
  overOdds: number;
  underOdds: number;
};



export const updateBettingLineFull: UpdateBettingLineFull<UpdateBettingLineFullArgs, BettingLine> = async (
    {id, category,
  isMoneyline,
  event,
  date,
  team1,
  team2,
  odds1,
  odds2,
  total,
  overOdds,
  underOdds},
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.BettingLine.update({
    where: {
      id: id,
    },
    data: {
      isMoneyline,
      category,
      event,
  date,
  team1,
  team2,
  odds1,
  odds2,
  total,
  overOdds,
  underOdds,
    },
  });
};
