'use client';

import { useState } from 'react';

export default function DocuMindUI() {
  const [documentName, setDocumentName] = useState('Wealth-Nations.pdf');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, documentName }),
      });
      const data = await response.json();
      setAnswer(data.answer || data.error);
    } catch (err) {
      setAnswer("Error connecting to the AI brain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">DocuMind AI</h1>
          <p className="text-lg text-gray-600">Query your Gold Data layer in real-time.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          <form onSubmit={askQuestion} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Document</label>
              <select 
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2 border"
              >
                <option value="Wealth-Nations.pdf">Wealth of Nations</option>
                <option value="The-Psychology-of-Money-Morgan-Housel.pdf">Psychology of Money</option>
                <option value="Money, Money, Money2.pdf">Money, Money, Money 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Your Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What does this book say about interest rates?"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 p-2 border"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </form>

          {answer && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">AI Response:</h3>
              <p className="text-gray-800 leading-relaxed">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
