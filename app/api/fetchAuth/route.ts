export async function POST(req: Request, res: Response) {
    const PASSKEY = process.env.PASSKEY;
    const { passkey } = await req.json();

    if (!passkey) {
        return Response.json({ error: 'Missing passkey' });
    }

    if (passkey !== PASSKEY) {
        return Response.json(0);
    }

    if (passkey === PASSKEY) {
        return Response.json(1);
    }
}
