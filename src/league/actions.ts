import { League } from "wasp/entities";
import { HttpError } from "wasp/server";
import { CreateLeague,} from "wasp/server/operations";

type CreateLineArgs = {
  name: string;
};

function generateLeagueCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  return code
}

export const createLeague: CreateLeague<CreateLineArgs, League> = async (
    { name},
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  context.entities.User.update({
    where: { id: context.user.id },
    data: {isAdmin: true}
  })


  return context.entities.League.create({
    data: {
        leagueManagerId: context.user.id,
        name: name,
      leagueCode: generateLeagueCode(),
      participants: {
        connect: { id: context.user.id }
      }
    },
  });
};
