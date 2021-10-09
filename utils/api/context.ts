import { PrismaClient } from "@prisma/client"
import auth0 from "../auth0";
import { getSession } from '@auth0/nextjs-auth0';
import { v4 as uuidv4 } from 'uuid';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    globalThis['prisma'] = globalThis['prisma'] || new PrismaClient();
    prisma = globalThis['prisma'];
}

export const context = async ({ req, res }) => {
    try {
      const { user: auth0User } = await getSession(req, res);
  
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