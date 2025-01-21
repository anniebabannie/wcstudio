import { Comic, PrismaClient } from "@prisma/client"
import { PageContextServer } from "vike/types"
import prisma from "../../../../server/prismaClient"

export type ReturnedData = {
  comic: Comic
}

const data = async (pageContext: PageContextServer) => {
  const comicId = pageContext.routeParams.id;
  const comic = await prisma.comic.findUnique({
    where: {
      id: comicId
    },
    include: {
      chapters: {
        include: {
          pages: {
            orderBy: {
              position: 'asc'
            }
          }
        }
      }
    }
  });

  return {
    comic
  };
}

export default data;