import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default async function chaptersDelete(req: Request, res: Response, prisma: PrismaClient) {
  try {
    const { id } = req.params;
    
    // First check if the chapter exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id }
    });

    if (!existingChapter) {
      return res.status(404).json({
        error: "Chapter not found"
      });
    }
    
    // Delete the chapter if it exists
    const chapter = await prisma.chapter.delete({
      where: { id }
    });

    return res.status(200).json({ 
      message: "Chapter deleted successfully",
      deletedId: chapter.id 
    });

  } catch (error) {
    console.error('Error deleting chapter:', error);
    return res.status(500).json({
      error: "Failed to delete chapter",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}