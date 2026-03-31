import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, HeartPulse, Microscope, Activity, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import QuoteSection from '@/components/QuoteSection';

const features = [
  {
    icon: <HeartPulse className="h-6 w-6 text-blue-600" />,
    title: "Clinical Excellence",
    description: "Our programs are designed to meet the highest standards of medical training, ensuring students are well-prepared for real-world healthcare challenges."
  },
  {
    icon: <Microscope className="h-6 w-6 text-green-600" />,
    title: "Modern Labs",
    description: "State-of-the-art laboratory facilities for hands-on training in Clinical Medicine and Radiology, providing a practical learning environment."
  },
  {
    icon: <Activity className="h-6 w-6 text-blue-600" />,
    title: "Expert Faculty",
    description: "Learn from experienced medical professionals and academic staff dedicated to mentoring the next generation of healthcare providers."
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/clinical-students-uniform/1920/1080"
            alt="Medical College Campus"
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md border border-blue-400/30 px-4 py-2 rounded-full">
              <Award className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Excellence in Medical Education</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Empowering the Next Generation of <span className="text-blue-400">Healthcare Leaders</span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed max-w-xl">
              Kigoma Clinical Officers Training College (KCOTC) provides comprehensive medical training in Clinical Medicine and Radiology, shaping compassionate professionals for Tanzania's healthcare future.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <Link
                to="/admissions"
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/programs"
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full text-lg font-bold transition-all active:scale-95"
              >
                <span>Our Programs</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-900">300+</div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-900">2</div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Core Programs</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-900">15+</div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Expert Faculty</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-900">98%</div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Why Choose KCOTC</h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">Dedicated to Your Professional Growth in Medicine</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              We provide a supportive and challenging environment where students can thrive both academically and personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-3xl border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-6 md:space-y-0">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Latest Updates</h2>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">College Announcements & News</h3>
            </div>
            <Link to="/admissions" className="text-blue-600 font-bold flex items-center space-x-2 hover:text-blue-700 transition-colors">
              <span>View All News</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex space-x-6 items-start">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center min-w-[80px]">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">May</div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-900">2026 Admissions Now Open</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Applications for the 2026 academic year are now being accepted. Apply before July 30th.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex space-x-6 items-start">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center min-w-[80px]">
                <div className="text-2xl font-bold text-blue-600">10</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">May</div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-900">New Radiology Lab Opening</h4>
                <p className="text-slate-600 text-sm leading-relaxed">We are excited to announce the opening of our new state-of-the-art radiology training laboratory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <QuoteSection />

      {/* Donation Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-blue-50 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Heart className="h-64 w-64 text-red-600" />
            </div>
            <div className="flex-1 space-y-8 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Support Our Mission</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Invest in the Future of <span className="text-red-600">Healthcare</span>
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Your donations help us provide modern equipment, scholarships, and better facilities for our clinical students. Join us in building a healthier Tanzania.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-red-600 text-white hover:bg-red-700 px-10 py-5 rounded-full text-lg font-bold transition-all shadow-xl shadow-red-200 active:scale-95">
                  Donate Now
                </button>
                <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-10 py-5 rounded-full text-lg font-bold transition-all active:scale-95">
                  Learn More
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <img
                src="https://picsum.photos/seed/clinical-uniform-donation/800/800"
                alt="Donation Impact"
                className="rounded-3xl shadow-2xl border-8 border-white rotate-3 hover:rotate-0 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://picsum.photos/seed/medical-pattern/1000/1000"
            alt="Pattern"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Start Your Medical Career?
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Join Kigoma Clinical Officers Training College today and take the first step towards becoming a qualified healthcare professional.
          </p>
          <div className="flex justify-center">
            <Link
              to="/admissions"
              className="bg-white text-blue-900 hover:bg-blue-50 px-10 py-5 rounded-full text-lg font-bold transition-all shadow-2xl active:scale-95"
            >
              Start Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
