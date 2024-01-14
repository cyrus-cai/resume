import ResponseCache from 'next/dist/server/response-cache';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import data from '../../../mock';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const model = process.env.MODEL;

export async function POST(request: Request, response: Response) {
    if (!model) {
        return Response.json("no model");
    }

    const { text } = await request.json();
    const PROMPT = '格式化此内容,输出标准的Markdown,请使用中文:'
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: `${PROMPT}${text}` }],
        model: model,
    });
    const data = chatCompletion.choices[0].message.content;
    console.log(data);
    return Response.json({ data });
}