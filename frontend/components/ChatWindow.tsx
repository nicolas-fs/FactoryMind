'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.answer,
        source: data.source
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error al comunicarse con el agente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 h-[70vh] flex flex-col">
      <div className="bg-blue-600 p-4 rounded-t-xl">
        <h2 className="text-white font-semibold">🤖 FactoryMind Agent</h2>
        <p className="text-blue-100 text-sm">Consulta tus manuales y procedimientos</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm">{msg.content}</p>
              {msg.source && (
                <p className="text-xs mt-2 text-gray-500 italic">📎 Fuente: {msg.source}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg animate-pulse">Pensando...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-gray-100 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pregunta sobre procedimientos, stock, mantenimiento..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors" disabled={loading}>
          Enviar
        </button>
      </form>
    </div>
  );
}