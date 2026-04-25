import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getGroundedChatResponse(question: string, context: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { 
        role: "system", 
        content: `You are a helpful assistant. Use ONLY the following context to answer. If not found, say 'Answer not found in provided documents.'\n\nContext: ${context}` 
      },
      { role: "user", content: question }
    ],
  });
  return response.choices[0].message.content;
}
