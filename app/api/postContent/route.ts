export async function POST(req: Request, res: Response) {
    const { url, content } = await req.json();

    if (!url || !content) {
        return Response.json({ error: 'Missing url or content' });
    }

    const response = await fetch(`https://midware-mresume-xii-kii.vercel.app/api/post`, {
        method: "POST",
        body: JSON.stringify({
            url: url,
            content: content
        })
    })

    return Response.json({ message: 'success' });
}