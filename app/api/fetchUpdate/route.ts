export async function POST(req: Request, res: Response) {

    const response = await fetch(`https://midware-mresume-xii-kii.vercel.app/api/fetchlatestversion`, {
        method: "POST",
    })

    const data = await response.json();
    console.log(data);

    return Response.json({ data });
}