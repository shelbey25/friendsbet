import { User } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  UpdateBalance, JoinLeague
} from "wasp/server/operations";

type UpdateBalanceArgs = {
  betCost: number;
};


export const updateBalance: UpdateBalance<UpdateBalanceArgs, User> = async (
  { betCost },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
        id: context.user.id,
    },
    data: {
      balance: context.user.balance - betCost,
    },
  });
};

type JoinLeagueArgs = {
  code: string;
};
export const joinLeague: JoinLeague<JoinLeagueArgs, User> = async (
  {code},
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
        id: context.user.id,
    },
    data: {
      league: { 
        connect: {
          leagueCode: code,
        }
      }
    },
  });
};
