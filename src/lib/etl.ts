import fs from 'fs';
import path from 'path';
import pdf from 'pdf-extraction';
import { cleanText } from './cleaner.js';

const BRONZE_DIR = './data/bronze';
const GOLD_DIR = './data/gold';

async function runETL() {
  if (!fs.existsSync(GOLD_DIR)) {
    fs.mkdirSync(GOLD_DIR, { recursive: true });
  }

  const files = fs.readdirSync(BRONZE_DIR).filter(file => file.endsWith('.pdf'));
  
  if (files.length === 0) {
    console.log("ℹ️ No PDFs found in data/bronze.");
    return;
  }

  for (const file of files) {
    try {
      const dataBuffer = fs.readFileSync(path.join(BRONZE_DIR, file));
      
      // Use the modern extraction library
      const data = await pdf(dataBuffer);
      const cleanedContent = cleanText(data.text);
      
      const output = {
        source: file,
        processedAt: new Date().toISOString(),
        content: cleanedContent
      };

      const fileName = file.replace('.pdf', '.json');
      fs.writeFileSync(path.join(GOLD_DIR, fileName), JSON.stringify(output, null, 2));
      console.log(`✅ Processed: ${file} -> ${fileName}`);
    } catch (err: any) {
      console.error(`❌ Failed to process ${file}:`, err.message);
    }
  }
}

runETL().catch(err => console.error("❌ ETL Crash:", err));
