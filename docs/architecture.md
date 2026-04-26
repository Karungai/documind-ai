# DocuMind AI Architecture Classification

## Architecture Category: Prompt-first / Long-context
DocuMind AI is classified as a **Prompt-first / long-context** architecture.
The system mainly relies on placing all relevant information directly into the model context before generating a response.

## Justification
This architecture was chosen because the application's domain (financial templates, quotes, and static tips) relies on a relatively small, highly curated dataset that easily fits within modern LLM context windows (like Gemini 1.5 Pro). 

### Tradeoffs Analyzed
- **Amount of data / number of files**: The dataset consists of a few static text files (Medallion architecture: Bronze, Silver, Gold layers). Concatenating them is trivial.
- **Context-window limits**: Modern models support up to 2 million tokens. Our curated templates are well under 10k tokens, meaning we never risk truncation under normal operation.
- **Retrieval or storage needs**: We avoid the overhead of setting up a vector database, embedding models, and chunking strategies.
- **Cost**: Sending the full context every time costs slightly more in input tokens per request compared to retrieving only relevant chunks. However, for a small user base and small data size, this compute cost is negligible compared to the infrastructure cost of maintaining a vector database.
- **Performance**: Latency is stable since there is no retrieval step.
- **Ease of debugging**: Highly transparent. We can see exactly what the LLM saw just by looking at the injected prompt.

## Rejected Alternative: Retrieval-first / RAG
The main alternative considered was **Retrieval-Augmented Generation (RAG)**.
We rejected this approach because the data corpus is small enough to fit in the context window. Implementing RAG would introduce unnecessary complexity: chunking strategies, embedding generation, vector storage, and potential retrieval misses (failing to retrieve the correct chunk).

## Important Capability Not Implemented: Tool-first / Function-Calling
We did not implement **function-calling**.
- **Whether it would improve the system**: It would significantly improve the system if we wanted to provide live stock prices or execute trades.
- **What problem it would solve**: Currently, the AI can only advise based on static files. It cannot retrieve real-time financial market data.
- **New complexity**: It would require implementing secure API integrations with financial data providers (like Alpha Vantage), adding latency, and requiring strict validation of tool outputs.
- **Future conditions for adoption**: We would adopt function-calling when user demand shifts from static budgeting advice to real-time portfolio management and market analysis.
- Case #	User Query	Expected Result	Actual Result	Status
1	"How much should I save?"	"At least 10%"	"At least 10%"	✅ PASS
2	"What is an emergency fund?"	"3-6 months of expenses"	"3-6 months of expenses"	✅ PASS
3	"Budgeting Template?"	Lists categories (Housing, etc)	Lists categories	✅ PASS
4 (Fail)	"How to fix a car?"	Refuse / Out of Scope	AI gave general car advice (Baseline)	❌ FAIL
5 (Fail)	"Compound interest calc"	Accurate Math	Quoted flawed text	❌ FAIL
  
