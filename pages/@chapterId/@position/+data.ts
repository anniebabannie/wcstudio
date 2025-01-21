import { PageContextServer } from "vike/types";
import prisma from "../../../server/prismaClient";

interface CustomPageContext extends PageContextServer {
  comicSlug: string | null;
}
const data = async (pageContext: CustomPageContext) => {
  const {comicSlug} = pageContext;
  const {position, chapterId } = pageContext.routeParams;
  const comic = await prisma.comic.findUnique({
    where: {
      slug: comicSlug!
    },
    include: {
      chapters: {
        where: {
          id: chapterId
        },
        include: {
          pages: {
            where: {
              AND: [
                { position: parseInt(position) },
                { chapterId: chapterId }
              ]
            }
          }
        }
      }
    }
  });

  console.log(comic);

  if (!comic) {
    throw new Error(`Comic with slug ${comicSlug} not found`);
  }
  return {
    comic,
    isMainSite: false,
  };
}

export default data;