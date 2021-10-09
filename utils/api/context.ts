import { PrismaClient } from "@prisma/client"
import { getSession } from '@auth0/nextjs-auth0';
import { v4 as uuidv4 } from 'uuid';

var prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Otherwise, a new client will be created on every reload
  globalThis['prisma'] = globalThis['prisma'] || new PrismaClient();
  prisma = globalThis['prisma'];
  // Many thanks to kripod for this fix:
  // https://github.com/blitz-js/blitz/blob/canary/examples/tailwind/db/index.ts
}
export const context = async ({ req, res }) => {
  try {
    // const { user: auth0User } = await getSession(req, res);
    const auth0User = {nickname: 'faker', sub: "1", picture: "/blank.png"};

    let user = await prisma.user.findUnique({
      where: { auth0: auth0User.sub },
    });
    if (!user) {
      const { picture, nickname, sub } = auth0User;
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          auth0: sub,
          picture,
          nickname,
        },
      });
    }
    return { user, prisma };
  } catch (e) {
    return { user: {}, prisma };
  }
};