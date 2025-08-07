import { BettingLine } from "wasp/entities";
import { HttpError } from "wasp/server";
import { UpdateBettingLine } from "wasp/server/operations";

type UpdateBetlineArgs = {
  lineId: string;
};

export const updateBettingLine: UpdateBettingLine<UpdateBetlineArgs, BettingLine> = async (
    {lineId},
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
      status: "complete",

    },
  });
};
