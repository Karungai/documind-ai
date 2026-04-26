'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } = useChat() as any;

  return (
    <div className="flex flex-col w-full max-w-3xl py-12 mx-auto stretch px-4 font-sans min-h-screen">
      <header className="mb-12 text-center backdrop-blur-sm bg-white/30 p-8 rounded-3xl shadow-xl border border-white/50">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500 tracking-tight drop-shadow-sm mb-3">DocuMind AI</h1>
        <p className="text-gray-600 font-medium tracking-wide">Premium Financial Advisor & Medallion Data Architecture</p>
      </header>

      <div className="space-y-6 mb-32 flex-1 overflow-y-auto px-2">
        {messages.length === 0 && (
          <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h3 className="text-xl font-bold text-gray-800 mb-2">👋 Welcome to your Premium Advisor</h3>
            <p className="text-gray-500">Ask me about your budget templates, money tips, or inspirational quotes.</p>
          </div>
        )}
        
        {messages.map((m: UIMessage) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm border ${
              m.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm border-blue-400/50 shadow-blue-500/20 shadow-lg' 
                : 'bg-white/80 backdrop-blur-md text-gray-800 rounded-tl-sm border-white shadow-xl'
            }`}>
              <span className="text-[11px] uppercase tracking-wider font-bold opacity-60 block mb-2 flex items-center gap-2">
                {m.role === 'user' ? (
                  <><span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> You</>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-emerald-400"></span> DocuMind Advisor</>
                )}
              </span>
              <div className="leading-relaxed prose prose-sm max-w-none">
                {m.parts && m.parts.map((p: any, i: number) => (
                  <span key={i}>{p.type === 'text' ? p.text : ''}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white/80 backdrop-blur-md text-gray-800 rounded-3xl rounded-tl-sm border-white shadow-xl p-5 flex gap-2 items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
            An error occurred: {error.message}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f0fdf4] via-[#f0fdf4]/90 to-transparent backdrop-blur-sm pointer-events-none">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative pointer-events-auto">
          <input
            className="w-full p-5 pr-14 rounded-full border-2 border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium"
            value={input}
            placeholder="Ask your financial question..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-blue-500/30 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}