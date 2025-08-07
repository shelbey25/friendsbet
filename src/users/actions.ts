import { User } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  UpdateBalance
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
