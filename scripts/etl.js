const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse'); // Even if using .txt, keeping this for robustness

async function runETL() {
    console.log("🚀 ETL START: Processing Silver to Gold...");
    const silverPath = './data/silver/money_tips.txt';
    const goldPath = './data/gold/money_tips.json';

    // 1. Ingestion
    const rawText = fs.readFileSync(silverPath, 'utf-8');

    // 2. Transformation (Cleaning & Chunking)
    const cleaned = rawText.replace(/\s+/g, ' ').trim();
    const chunks = cleaned.match(/.{1,500}/g) || []; // Break into 500-char pieces

    const goldData = {
        source: "money_tips.txt",
        processedAt: new Date().toISOString(),
        content: chunks.map((text, i) => ({ id: i, text: text }))
    };

    // 3. Storage (The "Gold" Layer)
    fs.writeFileSync(goldPath, JSON.stringify(goldData, null, 2));
    console.log("✅ ETL COMPLETE: Created data/gold/money_tips.json");
}
runETL();