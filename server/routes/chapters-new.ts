import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
	}
});

export default async function chaptersNew(req: Request, res: Response, prisma: PrismaClient) {
	try {
		const { comicId, title } = req.body;
		const files = req.files as Express.Multer.File[];
		console.log(files)
		const userId = req.user?.userId;
		console.log(req.body.pages)
		
		if (!userId) {
			console.log(req.user);
			console.log("======================");
			return res.status(401).json({ error: "User must be logged in" });
		}

		if (!files || files.length === 0) {
			return res.status(400).json({ error: "No images provided" });
		}

		if (!comicId) {
			return res.status(400).json({ error: "Comic ID is required" });
		}

		// Create the chapter in the database
		const chapter = await prisma.chapter.create({
			data: {
				title,
				comicId: comicId,
			}
		});

		// Upload images to S3 and create Pages
		const uploadPromises = files.map(async (file, index) => {
			// Generate a unique filename
			// const extension = file.originalname.split('.').pop();
			// const filename = `${uuidv4()}.${extension}`;
			const position = parseInt(req.body.positions[index]);
			const s3Key = `users/${userId}/comics/${comicId}/${chapter.id}/${file.originalname}`;

			// Upload to S3
			const uploadCommand = new PutObjectCommand({
				Bucket: process.env.BUCKET_NAME!,
				Key: s3Key,
				Body: file.buffer,
				ContentType: file.mimetype,
			});

			await s3Client.send(uploadCommand);

			// Create Page record in database
			return prisma.page.create({
				data: {
					chapterId: chapter.id,
					img: `${process.env.AWS_ENDPOINT_URL_S3}/${process.env.BUCKET_NAME}/${s3Key}`,
					position
				}
			});
		});

		// Wait for all uploads and database insertions to complete
		const pages = await Promise.all(uploadPromises);

		// Return the chapter with its pages
		const chapterWithPages = await prisma.chapter.findUnique({
			where: { id: chapter.id },
			include: {
				pages: {
					orderBy: { img: 'asc' }
				}
			}
		});

		return res.status(201).json(chapterWithPages);

	} catch (error) {
		console.error('Error creating chapter:', error);
		return res.status(500).json({
			error: "Failed to create chapter",
			details: error instanceof Error ? error.message : "Unknown error"
		});
	}
}