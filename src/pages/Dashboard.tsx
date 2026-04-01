import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  Award, 
  LogOut, 
  LayoutDashboard, 
  Bell, 
  Settings, 
  Calendar,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  Megaphone,
  Quote as QuoteIcon,
  Heart,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Result, Announcement, Message } from '@/types';
import { MEDICAL_QUOTES } from '@/constants/quotes';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [results, setResults] = useState<Result[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuote, setCurrentQuote] = useState(MEDICAL_QUOTES[0]);
  const [messageForm, setMessageForm] = useState({ subject: '', content: '' });
  const [formStatus, setFormStatus] = useState({ type: '', text: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'results'),
      where('studentUid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resultsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Result[];
      // Sort client-side to avoid requiring a composite index
      resultsData.sort((a, b) => b.createdAt - a.createdAt);
      setResults(resultsData);
    }, (error) => {
      console.error("Error fetching results:", error);
    });

    const aq = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeAnnouncements = onSnapshot(aq, (snapshot) => {
      const annData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any as Announcement[];
      setAnnouncements(annData);
    });

    const tq = query(collection(db, 'timetables'), orderBy('createdAt', 'desc'));
    const unsubscribeTimetables = onSnapshot(tq, (snapshot) => {
      const tData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTimetables(tData);
    });

    const mq = query(
      collection(db, 'messages'),
      where('senderId', '==', user.uid)
    );
    const unsubscribeMessages = onSnapshot(mq, (snapshot) => {
      const mData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any as Message[];
      mData.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(mData);
    });

    // Rotate quotes
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MEDICAL_QUOTES.length);
      setCurrentQuote(MEDICAL_QUOTES[randomIndex]);
    }, 12000);

    return () => {
      unsubscribe();
      unsubscribeAnnouncements();
      unsubscribeTimetables();
      unsubscribeMessages();
      clearInterval(quoteInterval);
    };
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/portal');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-900 tracking-tight">KCOTC</span>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'results' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Award className="h-5 w-5" />
            <span>Academic Results</span>
          </button>
          <button
            onClick={() => setActiveTab('timetables')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'timetables' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Timetables</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <User className="h-5 w-5" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'announcements' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Megaphone className="h-5 w-5" />
            <span>Announcements</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </div>
            {messages.filter(m => m.reply && !m.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {messages.filter(m => m.reply && !m.isRead).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{getGreeting()}, {user.name}!</h1>
            <p className="text-slate-500 font-medium mt-1">Here's what's happening with your academic progress.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl px-4 py-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs uppercase tracking-widest">
                {user.name.charAt(0)}
              </div>
              <div className="text-sm font-bold text-slate-700">{user.name}</div>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Current Program</div>
                  <div className="text-2xl font-bold text-slate-900">{user.program}</div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Fees Remaining</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {user.feesRemaining !== undefined 
                        ? (user.feesRemaining === 0 ? 'All Paid' : `${user.feesRemaining.toLocaleString()} TZS`) 
                        : 'Not Set'}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Academic Year</div>
                  <div className="text-2xl font-bold text-slate-900">Year 1</div>
                </div>
              </div>

              {/* Quote of the Moment */}
              <div className="bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <QuoteIcon className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                  <div className="text-blue-200 text-xs font-bold uppercase tracking-widest">Motivational Quote</div>
                  <h3 className="text-2xl font-serif italic leading-relaxed">"{currentQuote.text}"</h3>
                  <p className="text-blue-100 font-medium">— {currentQuote.author}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Results Preview */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Recent Results</h3>
                    <button onClick={() => setActiveTab('results')} className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-4">Course</th>
                          <th className="px-8 py-4">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {results.slice(0, 4).map((result, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-semibold text-slate-700">{result.courseName}</td>
                            <td className="px-8 py-5"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold">{result.grade}</span></td>
                          </tr>
                        ))}
                        {results.length === 0 && (
                          <tr>
                            <td colSpan={2} className="px-8 py-8 text-center text-slate-500">No results found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Announcements */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Announcements</h3>
                    <button onClick={() => setActiveTab('announcements')} className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {announcements.slice(0, 3).map((ann, idx) => (
                      <div key={idx} className="p-6 flex items-start space-x-4">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <Megaphone className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1">{ann.content}</p>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="p-8 text-center text-slate-500 text-sm">No announcements yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Academic Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Course Name</th>
                      <th className="px-8 py-4">Course Code</th>
                      <th className="px-8 py-4">Grade</th>
                      <th className="px-8 py-4">Semester</th>
                      <th className="px-8 py-4">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {results.map((result, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-semibold text-slate-700">{result.courseName}</td>
                        <td className="px-8 py-5 text-slate-500 font-mono text-sm">{result.courseCode}</td>
                        <td className="px-8 py-5"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold">{result.grade}</span></td>
                        <td className="px-8 py-5 text-slate-500 text-sm">{result.semester}</td>
                        <td className="px-8 py-5 text-slate-500 text-sm">{result.year}</td>
                      </tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-8 text-center text-slate-500">No results found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Announcements</h3>
                <p className="text-slate-500 text-sm mt-1">Stay updated with the latest news from the college.</p>
              </div>
              <div className="divide-y divide-slate-50">
                {announcements.map((ann, idx) => (
                  <div key={idx} className="p-8 flex items-start space-x-6">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <Megaphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                          ann.category === 'exam' ? 'bg-red-50 text-red-600' : 
                          ann.category === 'event' ? 'bg-purple-50 text-purple-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {ann.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{ann.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="p-12 text-center text-slate-500">No announcements at the moment.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timetables' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Academic Timetables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {timetables.map((tt, idx) => (
                    <div key={idx} className="p-6 border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{tt.program}</div>
                          <div className="text-sm text-slate-500">{tt.year} - {tt.semester}</div>
                        </div>
                      </div>
                      <a 
                        href={tt.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-white border border-slate-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  ))}
                  {timetables.length === 0 && (
                    <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No timetables uploaded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-8">
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-200">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
                    <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm">{user.program}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</div>
                    <div className="text-lg font-semibold text-slate-700">{user.email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registration Number</div>
                    <div className="text-lg font-semibold text-slate-700">{user.registrationNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fees Remaining</div>
                    <div className="text-lg font-semibold text-slate-700">
                      {user.feesRemaining !== undefined 
                        ? (user.feesRemaining === 0 ? 'All Paid' : `${user.feesRemaining.toLocaleString()} TZS`) 
                        : 'Not Set'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Semester</div>
                    <div className="text-lg font-semibold text-slate-700">Semester 1</div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-95">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-8">
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center text-slate-600">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Account Settings</h3>
                    <p className="text-slate-500 text-sm">Manage your account preferences and security.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <div className="font-bold text-slate-900">Email Notifications</div>
                      <div className="text-sm text-slate-500">Receive updates about your results via email.</div>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <div className="font-bold text-slate-900">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-500">Add an extra layer of security to your account.</div>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <button className="text-red-600 font-bold text-sm hover:underline">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'messages' && (
            <div className="max-w-3xl space-y-8">
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Send a Message</h3>
                  <p className="text-slate-500 text-sm mt-1">Contact the administration for any inquiries.</p>
                </div>

                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!messageForm.subject || !messageForm.content) return;
                    
                    try {
                      await addDoc(collection(db, 'messages'), {
                        senderId: user.uid,
                        senderName: user.name,
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
                  }}
                  className="space-y-6"
                >
                  {formStatus.text && (
                    <div className={`p-4 rounded-xl text-sm font-bold ${formStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {formStatus.text}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</label>
                    <input
                      type="text"
                      required
                      value={messageForm.subject}
                      onChange={e => setMessageForm({...messageForm, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="e.g., Question about fees"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message</label>
                    <textarea
                      required
                      value={messageForm.content}
                      onChange={e => setMessageForm({...messageForm, content: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      rows={4}
                      placeholder="Write your message here..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm"
                    >
                      Send Message
                    </button>
                  </div>
                </form>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-6">Your Messages</h4>
                  <div className="space-y-6">
                    {messages.map(msg => (
                      <div key={msg.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-slate-900">{msg.subject}</h5>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4">{msg.content}</p>
                        
                        {msg.reply && (
                          <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Admin Reply</p>
                            <p className="text-slate-700 text-sm">{msg.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center text-slate-500 py-8">No messages sent yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
