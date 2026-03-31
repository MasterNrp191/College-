import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, User, GraduationCap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';

export default function Portal() {
  const [isLogin, setIsLogin] = useState(true);
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [program, setProgram] = useState('Clinical Medicine');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(regNumber, password);
        navigate('/dashboard');
      } else {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }
        await register(regNumber, password, name, program);
        setError('Registration successful! Please wait for admin approval before logging in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative z-10"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isLogin ? 'Student Login' : 'Student Registration'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin 
              ? 'Access your academic results and profile' 
              : 'Create your student account to get started'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`bg-${error.includes('successful') ? 'green' : 'red'}-50 border border-${error.includes('successful') ? 'green' : 'red'}-200 text-${error.includes('successful') ? 'green' : 'red'}-600 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm font-medium`}>
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                Registration Number
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="e.g. KCOTC/2024/009"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Program of Study</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                >
                  <option value="Clinical Medicine">Clinical Medicine</option>
                  <option value="Clinical Radiology">Clinical Radiology</option>
                </select>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-end">
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              </>
            )}
          </button>
        </form>

        <div className="pt-6 text-center space-y-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors block w-full"
          >
            {isLogin 
              ? "Don't have an account? Register here" 
              : "Already have an account? Sign in here"}
          </button>
          <Link
            to="/staff-portal"
            className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors block w-full"
          >
            Are you a staff member? Go to Staff Portal
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-400 text-xs uppercase tracking-widest font-bold">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure Student Access</span>
        </div>
      </motion.div>
    </div>
  );
}
