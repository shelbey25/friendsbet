import { League, User } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type GetAllUsers, GetMyLeague } from "wasp/server/operations";


export const getAllUsers: GetAllUsers<void, User[]> = (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.findMany({
    where: {
      leagueId: context.user.leagueId,
    },
    orderBy: { balance: "desc" },
   
  });
};

type LeagueWithParticipants = League & {
  participants: User[];
};

export const getMyLeague: GetMyLeague<void, LeagueWithParticipants | null> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const userWithLeagues = await context.entities.User.findUnique({
    where: { id: context.user.id },
    include: { league: {
      include: {
        participants: {}}
    } } // 👈 must match the actual field in your Prisma schema
  });

  if (!userWithLeagues) {
    throw new HttpError(404, 'User not found.');
  }

  return userWithLeagues.league;
};
