import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/AuthContext';

export default function MessageUs() {
  const { user } = useAuth();
  const [messageForm, setMessageForm] = useState({ subject: '', content: '' });
  const [formStatus, setFormStatus] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.subject || !messageForm.content) return;

    setFormStatus({ type: '', text: '' });
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user?.uid || 'anonymous',
        senderName: user?.name || 'Anonymous',
        subject: messageForm.subject,
        content: messageForm.content,
        createdAt: Date.now(),
        isRead: false
      });
      setMessageForm({ subject: '', content: '' });
      setFormStatus({ type: 'success', text: 'Message sent successfully!' });
      setTimeout(() => setFormStatus({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      setFormStatus({ type: 'error', text: 'Failed to send message.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Mail className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Message Us</h1>
              <p className="text-slate-500">Have a question or feedback? Send us a message.</p>
            </div>
          </div>

          {formStatus.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center space-x-2 ${
              formStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {formStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{formStatus.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Subject</label>
              <input 
                type="text" 
                required
                value={messageForm.subject}
                onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="What is your message about?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Message</label>
              <textarea 
                required
                value={messageForm.content}
                onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                rows={6}
                placeholder="Type your message here..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
