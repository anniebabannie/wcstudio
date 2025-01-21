import { PageContextServer } from "vike/types";
import prisma from "../../server/prismaClient";
import { Comic } from "@prisma/client";
export type MainSiteData = {
  isMainSite: true;
}

export type ComicSiteData = {
  comic: Comic;
  isMainSite: false;
}

type PageData = MainSiteData | ComicSiteData;

// Extend the PageContextServer type to include our custom properties
interface CustomPageContext extends PageContextServer {
  comicSlug: string | null;
}
const data = async (pageContext: CustomPageContext) => {
  const { comicSlug } = pageContext;
  
  if (!comicSlug) {
    console.timeEnd("comicSlug");
    return {
      isMainSite: true
    };
  }
  
  console.time("prisma.comic.findUnique");
  const comic = await prisma.comic.findUnique({
    where: {
      slug: comicSlug
    },
    // Only select the fields you actually need
    select: {
      id: true,
      name: true,
      slug: true,
      desc: true,
      chapters: {
        select: {
          id: true,
          title: true,
          pages: {
            // Only select needed fields from pages
            select: {
              id: true,
              img: true,
              position: true
            },
            orderBy: {
              position: 'asc'
            }
          }
        }
      }
    }
  });
  console.timeEnd("prisma.comic.findUnique");
  if (!comic) {
    throw new Error(`Comic with slug ${comicSlug} not found`);
  }
  return {
    comic,
    isMainSite: false,
  };
}


export default data;