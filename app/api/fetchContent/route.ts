export async function POST(req: Request, res: Response) {

    const { url } = await req.json();

    if (!url) {
        return Response.json('Missing url');
    }

    const response = await fetch(`https://midware-mresume-xii-kii.vercel.app/api/fetch?url=${url}`);

    const data = await response.json();
    if (!data) {
        return Response.json('no data');
    }

    return Response.json(data);
}