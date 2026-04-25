import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getGroundedChatResponse } from '@/lib/services/ai';

export async function POST(req: Request) {
  try {
    const { question, documentName } = await req.json();
    const filePath = path.join(process.cwd(), 'data', 'gold', documentName.replace('.pdf', '.json'));
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Document data not found." }, { status: 404 });
    }

    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const answer = await getGroundedChatResponse(question, fileData.content);

    return NextResponse.json({ answer });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
