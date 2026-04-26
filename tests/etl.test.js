const fs = require('fs');
const path = require('path');

describe('ETL Pipeline Validation', () => {
  const goldPath = path.join(__dirname, '../data/gold/money_tips.json');

  test('Gold JSON file should exist after ETL execution', () => {
    const exists = fs.existsSync(goldPath);
    expect(exists).toBe(true);
  });

  test('Gold JSON should contain structured content chunks', () => {
    const rawData = fs.readFileSync(goldPath, 'utf8');
    const data = JSON.parse(rawData);

    expect(data).toHaveProperty('content');
    expect(Array.isArray(data.content)).toBe(true);
    expect(data.content.length).toBeGreaterThan(0);
    
    // Check if the first chunk has the required fields
    expect(data.content[0]).toHaveProperty('id');
    expect(data.content[0]).toHaveProperty('text');
  });
});