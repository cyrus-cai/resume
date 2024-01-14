import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// function Get:using url to get content
export async function POST(req: Request, res: Response) {
    try {
        const { url } = await req.json();

        if (!url) {
            return Response.json('Missing url');
        }

        const data = await prisma.user.findUnique({
            where: {
                url: url as string,
            },
        });

        console.log(data);
        return Response.json(data);
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' });
    }
}
