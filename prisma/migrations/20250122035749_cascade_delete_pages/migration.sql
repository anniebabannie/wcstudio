-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_chapterId_fkey";

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
