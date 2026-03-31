import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* College Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none">KCOTC</span>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest mt-1">Medical Training College</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Kigoma Clinical Officers Training College (KCOTC) is dedicated to excellence in medical education, shaping the next generation of healthcare professionals with integrity and compassion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-blue-500 transition-colors">Academic Programs</Link></li>
              <li><Link to="/admissions" className="hover:text-blue-500 transition-colors">Admissions</Link></li>
              <li><Link to="/portal" className="hover:text-blue-500 transition-colors">Student Portal</Link></li>
              <li><Link to="/staff-portal" className="hover:text-blue-500 transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Programs</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/programs" className="hover:text-blue-500 transition-colors">Clinical Medicine</Link></li>
              <li><Link to="/programs" className="hover:text-blue-500 transition-colors">Clinical Radiology</Link></li>
              <li><Link to="/admissions" className="hover:text-blue-500 transition-colors">Entry Requirements</Link></li>
              <li><Link to="/admissions" className="hover:text-blue-500 transition-colors">How to Apply</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Kigoma, Tanzania</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>+255 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <span>info@kcotc.ac.tz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {currentYear} Kigoma Clinical Officers Training College. All rights reserved.</p>
          <p>Created by <span className="text-blue-500 font-semibold">master</span></p>
        </div>
      </div>
    </footer>
  );
}
