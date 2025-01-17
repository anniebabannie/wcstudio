import { PageContextServer } from "vike/types";
import prisma from "../../server/prismaClient";

// Extend the PageContextServer type to include our custom properties
interface CustomPageContext extends PageContextServer {
  comicSlug: string | null;
}
const data = async (pageContext: CustomPageContext) => {
  const { comicSlug } = pageContext;

  if (!comicSlug) {
    return {
      isMainSite: true
    };
  }
  
  const comic = await prisma.comic.findUnique({
    where: {
      slug: comicSlug
    },
    include: {
      chapters: {
        include: {
          pages: true
        }
      }
    }
  });

  if (!comic) {
    throw new Error(`Comic with slug ${comicSlug} not found`);
  }
  return {
    comic,
    isMainSite: false,
  };
}


export default data;