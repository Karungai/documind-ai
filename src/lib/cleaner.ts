export function cleanText(text: string): string {
  // This regex finds all whitespace/newlines and replaces them with a single space
  return text.replace(/\s+/g, ' ').trim();
}
