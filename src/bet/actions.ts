import { Bet } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  CreateBet, SetBetResult
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

type ResultBetArgs = {
  lineId: string;
  correctSelection: string;
};

type ResultSummary = {
  success: boolean,
}

export const setBetResult: SetBetResult<ResultBetArgs, ResultSummary> = async (
  { lineId, correctSelection },
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const bets = await context.entities.Bet.findMany({
    where: { lineId }
  })

  for (const bet of bets) {
    const isWon = bet.selection === correctSelection
    const status = isWon ? 'won' : 'lost'

    // Update the bet status
    await context.entities.Bet.update({
      where: { id: bet.id },
      data: { status }
    })

    // Update user balance
    const user = await context.entities.User.findUnique({
      where: { id: bet.userId }
    })

    if (user) {

      const newBalance = isWon
        ? user.balance + bet.amount + bet.potentialWin
        : user.balance

      const newWinnings = isWon
        ? user.winnings + bet.potentialWin
        : user.winnings - bet.amount 

      await context.entities.User.update({
        where: { id: user.id },
        data: { balance: newBalance, winnings: newWinnings}
      })
    }
  }

  return { success: true }
};