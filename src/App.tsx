import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Programs from '@/pages/Programs';
import Admissions from '@/pages/Admissions';
import Portal from '@/pages/Portal';
import StaffPortal from '@/pages/StaffPortal';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import MessageUs from '@/pages/MessageUs';
import { AuthProvider } from '@/components/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
          <Routes>
            {/* Main Layout Routes */}
            <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
            <Route path="/about" element={<><Navbar /><main className="flex-grow"><About /></main><Footer /></>} />
            <Route path="/programs" element={<><Navbar /><main className="flex-grow"><Programs /></main><Footer /></>} />
            <Route path="/admissions" element={<><Navbar /><main className="flex-grow"><Admissions /></main><Footer /></>} />
            <Route path="/message-us" element={<><Navbar /><main className="flex-grow"><MessageUs /></main><Footer /></>} />
            <Route path="/portal" element={<><Navbar /><main className="flex-grow"><Portal /></main><Footer /></>} />
            <Route path="/staff-portal" element={<><Navbar /><main className="flex-grow"><StaffPortal /></main><Footer /></>} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/admin" element={
              <AuthGuard adminOnly>
                <Admin />
              </AuthGuard>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
