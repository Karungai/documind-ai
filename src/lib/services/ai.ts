import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getGroundedChatResponse(question: string, context: string) {
  const prompt = `You are a helpful assistant. Use ONLY the following context to answer the user's question. 
  If the answer is not in the context, say 'Answer not found in provided documents.'
  
  Context: ${context}
  
  User Question: ${question}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
