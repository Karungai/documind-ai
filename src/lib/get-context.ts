import fs from 'fs';
import path from 'path';

export function getGoldContext() {
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    // Reading from all three layers of your Medallion architecture
    const bronze = fs.readFileSync(path.join(dataDir, 'bronze/money_quotes.txt'), 'utf8');
    const silver = fs.readFileSync(path.join(dataDir, 'silver/money_tips.txt'), 'utf8');
    const gold = fs.readFileSync(path.join(dataDir, 'gold/budgeting_template.txt'), 'utf8');

    return `
      BRONZE LAYER (Quotes): ${bronze}
      SILVER LAYER (Tips): ${silver}
      GOLD LAYER (Template): ${gold}
    `;
  } catch (error) {
    console.error("Context Load Error:", error);
    return "Standard financial advice (Context files missing).";
  }
}