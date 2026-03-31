import { useState, useEffect } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from '@/types';

const quotes: Quote[] = [
  { text: "Wherever the art of medicine is loved, there is also a love of humanity.", author: "Hippocrates" },
  { text: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "William Osler" },
  { text: "Medicine is a science of uncertainty and an art of probability.", author: "William Osler" },
  { text: "To cure sometimes, to relieve often, to comfort always.", author: "Edward Livingston Trudeau" },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
];

export default function QuoteSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-blue-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full mb-10 shadow-lg shadow-blue-200">
          <QuoteIcon className="h-6 w-6 text-white" />
        </div>

        <div className="h-48 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-2xl md:text-3xl font-serif italic text-blue-900 leading-relaxed">
                "{quotes[currentIndex].text}"
              </p>
              <footer className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                — {quotes[currentIndex].author}
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-2 mt-12">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-blue-600" : "w-2 bg-blue-200 hover:bg-blue-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
