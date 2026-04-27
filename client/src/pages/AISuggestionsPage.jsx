import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
export default function AISuggestionsPage() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const chatMutation = useMutation({
    mutationFn: (msg) => api.post('/ai/chat', { message: msg }).then(r => r.data),
    onSuccess: (data) => setChatMessages(prev => [...prev, { role: 'ASSISTANT', content: data.message }]),
  });
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatMessages(prev => [...prev, { role: 'USER', content: message }]);
    chatMutation.mutate(message);
    setMessage('');
  };
  return (
    <>
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">AI Insights</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Get personalized nutrition advice.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6 flex flex-col h-[600px]">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span> NutriSense AI
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatMessages.length === 0 && <p className="text-center py-12 text-on-surface-variant">Ask me anything about nutrition!</p>}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'USER' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
                    <p className="font-body-md whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ask about nutrition..." />
              <button type="submit" className="px-4 py-3 bg-primary text-on-primary rounded-lg">
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Quick Questions</h2>
            <div className="space-y-2">
              {['What should I eat for dinner?', 'How to increase protein?', 'Suggest a healthy snack'].map(q => (
                <button key={q} onClick={() => { setChatMessages(prev => [...prev, { role: 'USER', content: q }]); chatMutation.mutate(q); }} className="w-full text-left p-3 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
