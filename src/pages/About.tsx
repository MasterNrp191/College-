import { motion } from 'motion/react';
import { Target, Eye, ShieldCheck, Users, GraduationCap, Building2 } from 'lucide-react';

const values = [
  { icon: <ShieldCheck className="h-6 w-6 text-blue-600" />, title: "Integrity", description: "Upholding the highest ethical standards in medical practice and education." },
  { icon: <Users className="h-6 w-6 text-green-600" />, title: "Compassion", description: "Fostering empathy and care for patients and the community." },
  { icon: <GraduationCap className="h-6 w-6 text-blue-600" />, title: "Excellence", description: "Striving for academic and clinical perfection in everything we do." },
  { icon: <Building2 className="h-6 w-6 text-green-600" />, title: "Collaboration", description: "Working together as a team to improve healthcare outcomes." }
];

const staff = [
  { name: "Dr. Jane Doe", role: "Principal", contact: "+255 712 345 678", quote: "Education is the most powerful weapon which you can use to change the world." },
  { name: "Dr. John Smith", role: "Head of Clinical Medicine", contact: "+255 713 456 789", quote: "The art of medicine consists of amusing the patient while nature cures the disease." },
  { name: "Sarah Williams", role: "Head of Clinical Radiology", contact: "+255 714 567 890", quote: "Radiology is the eye of medicine." },
  { name: "Michael Brown", role: "Registrar", contact: "+255 715 678 901", quote: "Organization is the key to academic success." }
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://picsum.photos/seed/about-medical/1920/1080"
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
            About KCOTC
          </motion.h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Discover our history, mission, and the values that drive our commitment to medical excellence.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our History</h2>
              <h3 className="text-4xl font-bold text-slate-900 leading-tight">A Legacy of Medical Training in Kigoma</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Founded with a vision to address the shortage of healthcare professionals in the Kigoma region, Kigoma Clinical Officers Training College (KCOTC) has grown from a small training center into a respected medical institution.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Over the years, we have successfully trained hundreds of clinical officers and radiology technicians who are now serving in various hospitals and clinics across Tanzania, making a significant impact on public health.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://picsum.photos/seed/college-history/800/600"
                alt="College History"
                className="rounded-3xl shadow-2xl border-8 border-white"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -left-10 bg-blue-600 p-8 rounded-3xl text-white shadow-xl hidden md:block">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-sm font-semibold uppercase tracking-widest opacity-80">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-blue-100 space-y-6">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To provide high-quality medical education and training that produces competent, ethical, and compassionate healthcare professionals dedicated to serving the community and improving health outcomes.
              </p>
            </div>
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-green-100 space-y-6">
              <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To be a leading medical training institution in East Africa, recognized for excellence in clinical education, research, and community service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our Core Values</h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">The Principles That Guide Us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900">{value.title}</h4>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our Leadership</h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight">Meet the Academic Staff</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {staff.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 text-center p-8 flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                <div className="text-slate-500 text-sm mb-4 font-medium italic">"{member.quote}"</div>
                <div className="mt-auto pt-4 border-t border-slate-50 w-full">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-sm font-semibold text-slate-700">{member.contact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
