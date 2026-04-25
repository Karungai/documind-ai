This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Pipeline and Data Flow

### Data Transformation Pipeline
1. **Raw Input:** The user types a financial question into the Chat UI (`page.tsx`).
2. **Transformation:** The query is sent to `/api/chat/route.ts`. The system reads the local `data/` directory (Bronze, Silver, and Gold layers) using `fs.readFileSync`.
3. **Prompt Construction:** The API concatenates the file contents into a single "System Context" block and prepends it to the user's message history along with system instructions.
4. **Model Output:** The Gemini model processes the prompt and streams the response back to the client.
5. **UI Display:** The client receives the stream and renders the Markdown output in the chat interface.

### Source of Truth
The app uses the `data/` directory as its single source of truth for financial context.
- Bronze: `money_quotes.txt`
- Silver: `money_tips.txt`
- Gold: `budgeting_template.txt`

### Debugging & Internal Information
For debugging and evaluation, the system architecture ensures we can observe:
- **Prompt text:** Visible in the `route.ts` API logic.
- **Model Name:** Hardcoded in `route.ts` (`gemini-1.5-pro`).
- **Data Layers:** The exact textual chunks are stored in `data/`.

### Potential Error Points
- If the `data/` files are missing or unreadable, the server will log an error and fall back to generic advice.
- If the context length exceeds the model's limit (unlikely with our current data size, but possible), it will cause an API failure.
