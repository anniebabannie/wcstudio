import { PrismaClient } from "@prisma/client";
import { PageContextServer } from "vike/types"
import type { Comic, Chapter, Page, Prisma } from "@prisma/client";
import { getChapterPages } from "../@slug/@pageNo/+data";

const data = async (pageContext: PageContextServer) => {

  return { 
   foobar: 'baz' 
  };
}

export { data }