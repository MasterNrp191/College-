import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, FileText, CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const steps = [
  { title: "Review Requirements", description: "Check if you meet the entry requirements for your chosen program." },
  { title: "Prepare Documents", description: "Gather your academic certificates, ID, and passport-sized photos." },
  { title: "Fill Application Form", description: "Complete the online application form or visit the college to get a physical form." },
  { title: "Submit Application", description: "Submit your application along with the required documents and application fee." },
  { title: "Wait for Admission", description: "Our admissions committee will review your application and notify you of the outcome." }
];

export default function Admissions() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) return;
    
    setIsSubmitting(true);
    setSubmitStatus({ type: '', text: '' });
    
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: `visitor_${contactForm.email}`,
        senderName: contactForm.name,
        senderEmail: contactForm.email,
        subject: contactForm.subject,
        content: contactForm.message,
        createdAt: Date.now(),
        isRead: false
      });
      setSubmitStatus({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus({ type: 'error', text: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://picsum.photos/seed/admissions-medical/1920/1080"
            alt="Medical Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Admissions
          </motion.h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed mb-10">
            Join our community of healthcare professionals. Learn about our admission process and requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="/portal" 
              className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-blue-900/40 flex items-center space-x-2 active:scale-95"
            >
              <span>Apply Now</span>
              <FileText className="h-5 w-5" />
            </a>
            <a 
              href="#requirements" 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-10 py-4 rounded-full text-lg font-bold transition-all backdrop-blur-md active:scale-95"
            >
              View Requirements
            </a>
          </div>
        </div>
      </section>

      {/* Admission Requirements */}
      <section id="requirements" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Admission Requirements</h2>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">General Requirements for All Programs</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To be considered for admission to Kigoma Clinical Officers Training College, applicants must meet the following general requirements:
              </p>
              <ul className="space-y-4">
                {[
                  "Certificate of Secondary Education (CSEE) with at least D passes in Physics, Chemistry, and Biology.",
                  "A minimum of D pass in English and Mathematics.",
                  "Good health and ethical conduct.",
                  "Proof of citizenship (National ID or Passport).",
                  "Two passport-sized photos."
                ].map((req, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-1" />
                    <span className="text-slate-600 leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Note:</strong> Meeting the minimum requirements does not guarantee admission. The admissions committee will review each application individually.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://picsum.photos/seed/admissions-process/800/600"
                alt="Admissions Process"
                className="rounded-3xl shadow-2xl border-8 border-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Application Process</h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">How to Apply to KCOTC</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg shadow-blue-200">
                  {idx + 1}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{step.title}</h4>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Contact Admissions</h2>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">Get in Touch with Our Admissions Office</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                If you have any questions about our programs or the application process, please don't hesitate to contact us.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-widest">Email</div>
                    <div className="text-lg font-semibold text-slate-700">admissions@kcotc.ac.tz</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-green-50 p-6 rounded-2xl border border-green-100">
                  <Phone className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="text-sm font-bold text-green-900 uppercase tracking-widest">Phone</div>
                    <div className="text-lg font-semibold text-slate-700">+255 123 456 789</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-widest">Location</div>
                    <div className="text-lg font-semibold text-slate-700">Kigoma, Tanzania</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 space-y-8">
              <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>
              {submitStatus.text && (
                <div className={`p-4 rounded-xl text-sm font-bold flex items-center space-x-2 ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span>{submitStatus.text}</span>
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                    placeholder="Application Inquiry" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Message</label>
                  <textarea 
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all h-32 resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
