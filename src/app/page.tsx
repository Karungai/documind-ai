'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';

export default function Chat() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch px-4 font-sans">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">DocuMind AI</h1>
        <p className="text-gray-500 mt-2 italic">Financial Advisor | Medallion Data Architecture</p>
      </header>

      <div className="space-y-6 mb-28">
        {messages.length === 0 && (
          <div className="bg-blue-50 p-8 rounded-2xl text-center text-blue-400 border-2 border-dashed border-blue-100">
            👋 Welcome! Ask me about your budget templates, money tips, or quotes.
          </div>
        )}
        {messages.map((m: UIMessage) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
            }`}>
              <span className="text-[10px] uppercase font-bold opacity-50 block mb-1">
                {m.role === 'user' ? 'You' : 'DocuMind Advisor'}
              </span>
              <div className="leading-relaxed">
                {m.parts && m.parts.map((p: any, i: number) => (
                  <span key={i}>{p.type === 'text' ? p.text : ''}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
          <input
            className="w-full p-4 pr-12 rounded-2xl border border-gray-300 shadow-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
            value={input}
            placeholder="Ask a financial question..."
            onChange={handleInputChange}
          />
          <button type="submit" className="absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors">
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}