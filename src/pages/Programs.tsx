import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HeartPulse, Microscope, Clock, GraduationCap, CheckCircle2 } from 'lucide-react';

const programs = [
  {
    icon: <HeartPulse className="h-8 w-8 text-blue-600" />,
    title: "Clinical Medicine",
    description: "Our Clinical Medicine program is designed to produce competent clinical officers who can provide high-quality healthcare services in various settings.",
    duration: "3 Years",
    requirements: [
      "Certificate of Secondary Education (CSEE) with at least D passes in Physics, Chemistry, and Biology.",
      "A minimum of D pass in English and Mathematics.",
      "Good health and ethical conduct."
    ],
    image: "https://picsum.photos/seed/clinical-medicine/800/600"
  },
  {
    icon: <Microscope className="h-8 w-8 text-green-600" />,
    title: "Clinical Radiology",
    description: "The Clinical Radiology program focuses on training technicians in diagnostic imaging, ensuring they can operate modern radiology equipment safely and effectively.",
    duration: "3 Years",
    requirements: [
      "Certificate of Secondary Education (CSEE) with at least D passes in Physics, Chemistry, and Biology.",
      "A minimum of D pass in English and Mathematics.",
      "Good health and ethical conduct."
    ],
    image: "https://picsum.photos/seed/radiology/800/600"
  }
];

export default function Programs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://picsum.photos/seed/programs-medical/1920/1080"
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
            Academic Programs
          </motion.h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Explore our specialized medical training programs and start your journey towards becoming a healthcare professional.
          </p>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {programs.map((program, idx) => (
            <div key={idx} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                  {program.icon}
                </div>
                <h2 className="text-4xl font-bold text-slate-900 leading-tight">{program.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {program.description}
                </p>
                
                <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-blue-900 uppercase tracking-widest">Duration</div>
                    <div className="text-lg font-semibold text-slate-700">{program.duration}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-3">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                    <span>Entry Requirements</span>
                  </h3>
                  <ul className="space-y-4">
                    {program.requirements.map((req, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-1" />
                        <span className="text-slate-600 leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`relative ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <img
                  src={program.image}
                  alt={program.title}
                  className="rounded-3xl shadow-2xl border-8 border-white"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 bg-green-600 p-8 rounded-3xl text-white shadow-xl hidden md:block">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-sm font-semibold uppercase tracking-widest opacity-80">Employment Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Not Sure Which Program is Right for You?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our academic advisors are here to help you choose the program that best aligns with your career goals and interests.
          </p>
          <div className="flex justify-center">
            <Link
              to="/admissions"
              className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-5 rounded-full text-lg font-bold transition-all shadow-2xl active:scale-95"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
