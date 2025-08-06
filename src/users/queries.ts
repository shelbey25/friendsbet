import { User } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type GetAllUsers } from "wasp/server/operations";


export const getAllUsers: GetAllUsers<void, User[]> = (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.findMany({
    orderBy: { balance: "desc" },
   
  });
};

