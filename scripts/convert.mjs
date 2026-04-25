import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

async function convert() {
    try {
        const filePath = './data/gold/The-Psychology-of-Money-Morgan-Housel.pdf';
        
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            return;
        }

        const dataBuffer = fs.readFileSync(filePath);
        console.log("🛠️ Converting PDF to Silver Text...");

        // Log the type to debug if it fails again
        // console.log("Debug - PDF type:", typeof pdf);

        // This is the common fix for this specific library in ESM
        const data = await pdf(dataBuffer);
        
        fs.writeFileSync('./data/gold/processed_money.txt', data.text);
        console.log("✅ Success! data/gold/processed_money.txt created.");
    } catch (error) {
        // If the above still fails, try one last specific property
        try {
            const data = await pdf.default(dataBuffer);
            fs.writeFileSync('./data/gold/processed_money.txt', data.text);
            console.log("✅ Success (via default export)! data/gold/processed_money.txt created.");
        } catch (innerError) {
            console.error("❌ Conversion failed again:", error.message);
        }
    }
}

convert();