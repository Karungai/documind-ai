# Assignment 6: System Evaluation

## 1. Output Quality Evaluation
**Task:** Financial advice, budgeting assistance, and quote retrieval.
**Metric:** Rubric scoring (1-5) based on accuracy to the curated Bronze, Silver, and Gold data layers. This metric makes sense because the system is designed to provide *specific* advice based on our templates, not just general LLM knowledge.

## 2. Representative Cases (5 Successes)
We conducted end-to-end task success evaluations to ensure the system works from user input to final UI display:

1. **Query:** "How should I structure my budget?" 
   - **Result:** Success (5/5). System correctly retrieved and outputted the exact categories from `budgeting_template.txt` (Gold layer).
2. **Query:** "Give me a motivational quote about wealth."
   - **Result:** Success (5/5). System successfully pulled from `money_quotes.txt` (Bronze layer).
3. **Query:** "What are some practical money tips?"
   - **Result:** Success (5/5). System listed the exact 10 tips from `money_tips.txt` (Silver layer).
4. **Query:** "How much of my paycheck should I save?"
   - **Result:** Success (5/5). System referenced tip #2 from the Silver layer ("Save at least 10% of every paycheck").
5. **Query:** "Where should I put my emergency fund and how big should it be?"
   - **Result:** Success (5/5). System referenced tip #4 from the Silver layer ("Build an emergency fund with 3–6 months of expenses").

## 3. Failure Cases (2 Failures)
1. **Upstream Component Failure (Data Typo):** The `money_tips.txt` (Silver layer) contained a mathematically flawed compound interest formula (`A = P(1 - r/n)^(nt)` instead of `+`). 
   - **Result:** The LLM originally repeated this incorrect formula verbatim without checking it, leading to bad financial advice.
2. **Context Limit / Irrelevance Failure:** When asked for a 50-page deep dive on tax evasion, the system hallucinated.
   - **Result:** Since tax evasion is not in the context, and the system prompt forces it to be a helpful advisor, it gave generic (and sometimes irrelevant) advice rather than strictly saying "I don't know."

## 4. Lightweight Baseline Comparison
- **Baseline:** A simple prompt without the local `data/` `.txt` files (No-context baseline).
- **Result:** The baseline gave generic advice when asked "How should I structure my budget?" My system gave specific, tailored advice directly mapped to the categories in the `budgeting_template.txt`. This proves the architecture successfully grounds the model in our specific data.

## 5. System Improvement Based on Evidence
**What looked weak / failed:** 
The system blindly trusted the "Silver" data layer, even when it contained a mathematically incorrect formula (Failure Case #1). 

**What I changed:**
I improved the system prompt in `/api/chat/route.ts`. I added a strict directive: *"IMPORTANT SYSTEM IMPROVEMENT: Before outputting any financial formulas from the context, carefully verify them for mathematical correctness. If a formula in the context is incorrect, quietly fix it in your response and do not repeat the typo."*

**What improved:**
Now, when asked about compound interest, the LLM catches the flawed `(1 - r/n)` in the context and outputs the correct `(1 + r/n)` formula. It no longer regurgitates bad upstream data.

**What still remains weak:**
The system is still vulnerable to extremely long, out-of-scope prompts that try to push it past its specific context boundaries (Failure Case #2). Future improvements could include a routing layer to reject out-of-scope queries entirely.