import { Bet } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  CreateBet
} from "wasp/server/operations";

type CreateBetArgs = {
  lineId: string;
  amount: number;
  selection: string;
    potentialWin: number;
};


export const createBet: CreateBet<CreateBetArgs, Bet> = async (
  { lineId, amount, selection, potentialWin },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Bet.create({
    data: {
      amount, 
      selection, 
      potentialWin,
        date: new Date().toDateString(),
        status: "pending",
      user: {
        connect: {
          id: context.user.id,
        },
      },

      line: {
        connect: {
            id: lineId,
        }
      }
    },
  });
};
