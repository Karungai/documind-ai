import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { question, documentName } = await req.json();
    
    // 1. Load the Gold data
    const filePath = path.join(process.cwd(), 'data', 'gold', documentName.replace('.pdf', '.json'));
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Document data not found." }, { status: 404 });
    }

    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // 2. Query the LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant. Use ONLY the following context to answer the user's question. If the answer is not in the context, say 'Answer not found in provided documents.'\n\nContext: " + fileData.content },
        { role: "user", content: question }
      ],
    });

    return NextResponse.json({ answer: response.choices[0].message.content });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
