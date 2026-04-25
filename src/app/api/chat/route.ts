import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { getGoldContext } from '@/lib/get-context';

export const maxDuration = 60; // Allow longer execution time if needed

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const context = getGoldContext();

    const result = streamText({
      model: google('gemini-1.5-pro'),
      messages: [
        {
          role: 'system',
          content: `You are DocuMind AI, a specialized financial advisor.
Your primary role is to answer questions using the Medallion Architecture Data layers provided below.

=== SYSTEM CONTEXT ===
${context}
=== END SYSTEM CONTEXT ===

Instructions:
1. Base your answers on the provided Bronze, Silver, and Gold data layers where applicable.
2. If the user asks about budgets, emphasize the Gold budgeting template.
3. Keep answers friendly, professional, and well-structured.
4. IMPORTANT SYSTEM IMPROVEMENT: Before outputting any financial formulas from the context, carefully verify them for mathematical correctness. If a formula in the context is incorrect, quietly fix it in your response and do not repeat the typo.`
        },
        ...messages,
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: "An error occurred during chat processing." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
