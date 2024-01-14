import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
    try {
        const { url, content } = await req.json();

        if (!url || !content) {
            return Response.json({ error: 'Missing url or content' });
        }

        // Check if a record with the given URL already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                url: url,
            },
        });

        let data;
        if (existingUser) {
            // If it exists, update the content
            data = await prisma.user.update({
                where: {
                    url: url,
                },
                data: {
                    content: content,
                },
            });
        } else {
            // If it doesn't exist, create a new record
            data = await prisma.user.create({
                data: {
                    url: url,
                    content: content,
                },
            });
        }

        console.log(data);
        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' });
    }
}