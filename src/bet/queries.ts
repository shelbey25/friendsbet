import { Bet, BettingLine, User } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type GetAllBets, type GetEveryoneBets } from "wasp/server/operations";

export type BetWithLine = Bet & { line: BettingLine };

export const getAllBets: GetAllBets<void, BetWithLine[]> = (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Bet.findMany({
    orderBy: { realDate: "desc" },
    where: {
        userId: context.user.id,
    },
    include: {
        line: {}
    }
  });
};

export type BetWithLineAndUser = Bet & { line: BettingLine } & { user: User };

export const getEveryoneBets: GetEveryoneBets<void, BetWithLineAndUser[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const betEntities = await context.entities.Bet.findMany({
    orderBy: { realDate: "desc" },
    include: {
        line: {},
        user: {}
    }
  });

  const filteredBets = betEntities.filter(bet => bet.line.leagueId === context.user?.leagueId);

  return filteredBets;
};

