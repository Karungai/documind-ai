import { describe, it, expect } from 'vitest';
import { cleanText } from '../lib/cleaner';

describe('Text Cleaner Logic', () => {
  it('should remove excessive whitespace and newlines', () => {
    const rawInput = "This is a   test\n\nwith messy   lines.";
    const expectedOutput = "This is a test with messy lines.";
    
    expect(cleanText(rawInput)).toBe(expectedOutput);
  });
});
