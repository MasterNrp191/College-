import { useState, useEffect, FormEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  LayoutDashboard, 
  LogOut, 
  ShieldCheck, 
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  Megaphone,
  Quote as QuoteIcon,
  Save,
  X,
  Calendar,
  Heart,
  Clock,
  MessageSquare,
  Menu,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Student, Result, Announcement, UserRole, Message } from '@/types';
import { useAuth } from '@/components/AuthContext';
import { MEDICAL_QUOTES } from '@/constants/quotes';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentQuote, setCurrentQuote] = useState(MEDICAL_QUOTES[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Edit Modal State
  const [editingUser, setEditingUser] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStudentForm, setAddStudentForm] = useState({
    name: '',
    registrationNumber: '',
    program: 'Clinical Medicine' as const
  });

  // Approval Modals
  const [approvalUser, setApprovalUser] = useState<Student | null>(null);
  const [rejectUser, setRejectUser] = useState<Student | null>(null);
  const [approvalRole, setApprovalRole] = useState<UserRole>('student');

  // Edit Announcement State
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Upload File to Student State
  const [uploadFileModalUser, setUploadFileModalUser] = useState<Student | null>(null);
  const [studentFileForm, setStudentFileForm] = useState({
    fileName: '',
    fileUrl: ''
  });

  const { logout, isAdmin, isEditor, isBursar } = useAuth();
  const navigate = useNavigate();

  // Form state for results
  const [resultForm, setResultForm] = useState({
    courseName: '',
    courseCode: '',
    grade: '',
    semester: 'Semester 1',
    year: '2024/2025'
  });

  // Form state for announcements
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    category: 'notice' as const,
    fileUrl: ''
  });

  const [timetableForm, setTimetableForm] = useState({
    program: 'Clinical Medicine',
    year: '2024/2025',
    semester: 'Semester 1',
    fileUrl: ''
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any as Student[];
      setAllUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    const aq = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribeAnnouncements = onSnapshot(aq, (snapshot) => {
      const annData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any as Announcement[];
      setAnnouncements(annData);
    });

    // Fetch Timetables
    const tq = query(collection(db, 'timetables'), orderBy('createdAt', 'desc'));
    const unsubscribeTimetables = onSnapshot(tq, (snapshot) => {
      const tData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTimetables(tData);
    });

    // Fetch Messages
    const mq = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribeMessages = onSnapshot(mq, (snapshot) => {
      const mData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any as Message[];
      setMessages(mData);
    });

    // Rotate quotes
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MEDICAL_QUOTES.length);
      setCurrentQuote(MEDICAL_QUOTES[randomIndex]);
    }, 10000);

    return () => {
      unsubscribe();
      unsubscribeAnnouncements();
      unsubscribeTimetables();
      unsubscribeMessages();
      clearInterval(quoteInterval);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/portal');
  };

  const handleApprove = async () => {
    if (!approvalUser) return;
    try {
      await updateDoc(doc(db, 'users', approvalUser.id!), { 
        approved: true,
        role: approvalRole
      });
      setMessage({ type: 'success', text: 'Account approved successfully!' });
      setApprovalUser(null);
    } catch (error) {
      console.error("Error approving account:", error);
      setMessage({ type: 'error', text: 'Failed to approve account.' });
    }
  };

  const handleReject = async () => {
    if (!rejectUser) return;
    try {
      await deleteDoc(doc(db, 'users', rejectUser.id!));
      setMessage({ type: 'success', text: 'Registration rejected and removed.' });
      setRejectUser(null);
    } catch (error) {
      console.error("Error rejecting account:", error);
      setMessage({ type: 'error', text: 'Failed to reject account.' });
    }
  };

  const handleUploadStudentFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFileModalUser) return;
    try {
      await addDoc(collection(db, 'student_files'), {
        studentUid: uploadFileModalUser.uid,
        fileName: studentFileForm.fileName,
        fileUrl: studentFileForm.fileUrl,
        createdAt: Date.now()
      });
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setUploadFileModalUser(null);
      setStudentFileForm({ fileName: '', fileUrl: '' });
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage({ type: 'error', text: 'Failed to upload file.' });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setMessage({ type: 'success', text: `User role updated to ${newRole}.` });
    } catch (error) {
      console.error("Error updating role:", error);
      setMessage({ type: 'error', text: 'Failed to update role.' });
    }
  };

  const handleUploadResult = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setMessage({ type: 'error', text: 'Please select a student.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const student = allUsers.find(s => s.id === selectedStudentId);
      if (!student) throw new Error("Student not found");

      await addDoc(collection(db, 'results'), {
        ...resultForm,
        studentUid: student.uid,
        createdAt: Date.now()
      });

      setMessage({ type: 'success', text: 'Result uploaded successfully!' });
      setResultForm({
        courseName: '',
        courseCode: '',
        grade: '',
        semester: 'Semester 1',
        year: '2024/2025'
      });
      setSelectedStudentId('');
    } catch (error: any) {
      console.error("Error uploading result:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload result.' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await updateDoc(doc(db, 'announcements', editingAnnouncement.id!), {
          ...announcementForm
        });
        setMessage({ type: 'success', text: 'Announcement updated!' });
        setEditingAnnouncement(null);
      } else {
        await addDoc(collection(db, 'announcements'), {
          ...announcementForm,
          date: Date.now(),
          createdAt: Date.now()
        });
        setMessage({ type: 'success', text: 'Announcement posted!' });
      }
      setAnnouncementForm({ title: '', content: '', category: 'notice', fileUrl: '' });
    } catch (error) {
      console.error("Error posting announcement:", error);
      setMessage({ type: 'error', text: 'Failed to post announcement.' });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleAddTimetable = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'timetables'), {
        ...timetableForm,
        createdAt: Date.now()
      });
      setTimetableForm({ program: 'Clinical Medicine', year: '2024/2025', semester: 'Semester 1', fileUrl: '' });
      setMessage({ type: 'success', text: 'Timetable added successfully!' });
    } catch (err) {
      console.error("Error adding timetable:", err);
      setMessage({ type: 'error', text: 'Failed to add timetable.' });
    }
  };

  const handleDeleteTimetable = async (id: string) => {
    if (window.confirm('Delete this timetable?')) {
      await deleteDoc(doc(db, 'timetables', id));
    }
  };

  const seedSampleData = async () => {
    if (!window.confirm('This will seed sample data for testing. Continue?')) return;
    
    try {
      // Sample Timetable
      await addDoc(collection(db, 'timetables'), {
        program: 'Clinical Medicine',
        year: '2024/2025',
        semester: 'Semester 1',
        fileUrl: 'https://example.com/timetable.pdf',
        createdAt: Date.now()
      });

      setMessage({ type: 'success', text: 'Sample data seeded successfully!' });
    } catch (err) {
      console.error("Seed error:", err);
      setMessage({ type: 'error', text: 'Failed to seed data.' });
    }
  };

  const handleEditUser = (user: Student) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUserEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.id) return;

    try {
      const { id, ...updateData } = editingUser;
      await updateDoc(doc(db, 'users', id), updateData);
      setIsEditModalOpen(false);
      setMessage({ type: 'success', text: 'User profile updated successfully!' });
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage({ type: 'error', text: 'Failed to update user profile.' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user record? This will not delete their authentication account.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setMessage({ type: 'success', text: 'User record deleted.' });
      } catch (error) {
        console.error("Error deleting user:", error);
        setMessage({ type: 'error', text: 'Failed to delete user.' });
      }
    }
  };

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Validate registration number format: NS0108/0021/2024 or KCOTC/2024/009
      const regRegex = /^([A-Z]{2}\d{4}\/\d{4}\/\d{4}|KCOTC\/\d{4}\/\d{3})$/;
      if (!regRegex.test(addStudentForm.registrationNumber)) {
        setMessage({ type: 'error', text: 'Invalid registration number format. Expected: NS0108/0021/2024 or KCOTC/2024/009' });
        return;
      }

      const email = `${addStudentForm.registrationNumber.replace(/\//g, '_')}@kcotc.ac.tz`;
      
      // Check if student already exists
      const existing = allUsers.find(u => u.registrationNumber === addStudentForm.registrationNumber);
      if (existing) {
        setMessage({ type: 'error', text: 'Student with this registration number already exists.' });
        return;
      }

      await addDoc(collection(db, 'users'), {
        ...addStudentForm,
        email,
        uid: `manual_${Date.now()}`, // Placeholder UID for manually added students
        role: 'student',
        approved: true,
        createdAt: Date.now()
      });

      setIsAddModalOpen(false);
      setAddStudentForm({ name: '', registrationNumber: '', program: 'Clinical Medicine' });
      setMessage({ type: 'success', text: 'Student record added successfully!' });
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage({ type: 'error', text: 'Failed to add student record.' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Registration Number', 'Program', 'Email', 'Role', 'Approved'];
    const rows = students.map(s => [
      s.name,
      s.registrationNumber,
      s.program,
      s.email,
      s.role,
      s.approved ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_list_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const students = allUsers.filter(u => u.role === 'student' && u.approved);
  const pending = allUsers.filter(u => !u.approved);
  const staff = allUsers.filter(u => u.role !== 'student' && u.approved);
  const unreadMessages = messages.filter(m => !m.isRead);

  const conversations = useMemo(() => {
    const groups = new Map<string, { user: { id: string, name: string }, messages: Message[], unreadCount: number, lastMessageAt: number }>();
    messages.forEach(msg => {
      if (!groups.has(msg.senderId)) {
        groups.set(msg.senderId, { user: { id: msg.senderId, name: msg.senderName }, messages: [], unreadCount: 0, lastMessageAt: 0 });
      }
      const group = groups.get(msg.senderId)!;
      group.messages.push(msg);
      if (!msg.isRead) {
        group.unreadCount++;
      }
      if (msg.createdAt > group.lastMessageAt) {
        group.lastMessageAt = msg.createdAt;
      }
    });
    return Array.from(groups.values()).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [messages]);

  const selectedConversation = conversations.find(c => c.user.id === selectedUserId);

  const filteredList = (list: Student[]) => list.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8 border-b border-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-xl shadow-lg shadow-blue-900/50">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Staff Panel</span>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            ...(isAdmin ? [
              { id: 'approvals', label: 'Approvals', icon: UserCheck, count: pending.length },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'staff', label: 'Staff & Editors', icon: ShieldCheck },
            ] : []),
            ...(isBursar ? [
              { id: 'students', label: 'Students', icon: Users },
            ] : []),
            ...(!isBursar ? [
              { id: 'results', label: 'Upload Results', icon: Upload },
              { id: 'timetables', label: 'Timetables', icon: Calendar },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessages.length },
              { id: 'settings', label: 'Settings', icon: Settings },
            ] : []),
          ].filter((tab, index, self) => self.findIndex(t => t.id === tab.id) === index).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <div className="flex items-center space-x-3">
                <tab.icon className={`h-5 w-5 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto bg-slate-50/50">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center space-x-3">
              <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              {activeTab === 'overview' ? 'Welcome back! Here is what is happening today.' : `Manage ${activeTab} and system settings.`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all w-64"
              />
            </div>
            {activeTab === 'students' && isAdmin && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Student</span>
              </button>
            )}
          </div>
        </header>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl flex items-center justify-between space-x-3 text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage({ type: '', text: '' })}><X className="h-4 w-4" /></button>
          </motion.div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Students', value: students.length, icon: Users, color: 'blue' },
                { label: 'Total Staff', value: staff.length, icon: ShieldCheck, color: 'green' },
                { label: 'Pending Approvals', value: pending.length, icon: UserPlus, color: 'orange' },
                { label: 'New Messages', value: unreadMessages.length, icon: MessageSquare, color: 'purple' },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 group cursor-pointer"
                >
                  <div className={`bg-${stat.color}-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-7 w-7 text-${stat.color}-600`} />
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-6 max-w-2xl">
                <h3 className="text-3xl font-bold">System Maintenance</h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Use the button below to seed sample data for testing purposes. This will add a sample timetable and donation record.
                </p>
                <button 
                  onClick={seedSampleData}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Seed Sample Data</span>
                </button>
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

            {/* Recent Announcements */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Recent Announcements</h3>
                <button onClick={() => setActiveTab('announcements')} className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="divide-y divide-slate-50">
                {announcements.slice(0, 3).map((ann, idx) => (
                  <div key={idx} className="p-8 flex items-start space-x-4">
                    <div className="bg-slate-100 p-3 rounded-xl">
                      <Megaphone className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{ann.title}</h4>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{ann.content}</p>
                      <div className="flex items-center space-x-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>{ann.category}</span>
                        <span>•</span>
                        <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="p-12 text-center text-slate-500">No announcements yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Pending Registrations</h3>
              <p className="text-slate-500 text-sm mt-1">Review and approve new student and staff accounts.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Reg Number / Email</th>
                    <th className="px-8 py-4">Role / Program</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredList(pending).map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-semibold text-slate-700">{user.name}</td>
                      <td className="px-8 py-5 text-slate-500 font-mono text-sm">
                        {user.role === 'student' ? user.registrationNumber : user.email}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg font-bold text-xs ${user.role === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {user.role === 'student' ? user.program : user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setApprovalUser(user);
                              setApprovalRole(user.role);
                            }}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                            title="Approve"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setRejectUser(user)}
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                            title="Reject"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredList(pending).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-500">No pending approvals.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Approved Students</h3>
              <div className="flex space-x-2">
                <button onClick={handleExportCSV} className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-1 rounded-lg border border-slate-200">Export CSV</button>
                <button onClick={handlePrint} className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-1 rounded-lg border border-slate-200">Print List</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Student Name</th>
                    <th className="px-8 py-4">Reg Number</th>
                    <th className="px-8 py-4">Program</th>
                    <th className="px-8 py-4">Email</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredList(students).map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5 font-semibold text-slate-700">{user.name}</td>
                      <td className="px-8 py-5 text-slate-500 font-mono text-sm">{user.registrationNumber}</td>
                      <td className="px-8 py-5"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold text-xs">{user.program}</span></td>
                      <td className="px-8 py-5 text-slate-500 text-sm">{user.email}</td>
                      <td className="px-8 py-5 text-right">
                        {(isAdmin || isBursar) && (
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setUploadFileModalUser(user)} className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Upload File"><Upload className="h-4 w-4" /></button>
                            <button onClick={() => handleEditUser(user)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Edit Student"><Edit className="h-4 w-4" /></button>
                            {isAdmin && (
                              <button onClick={() => handleDeleteUser(user.id!)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete Student"><Trash2 className="h-4 w-4" /></button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredList(students).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-500">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Staff & Editors</h3>
              <p className="text-slate-500 text-sm mt-1">Manage administrative roles and editor privileges.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Email</th>
                    <th className="px-8 py-4">Current Role</th>
                    <th className="px-8 py-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staff.map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-semibold text-slate-700">{user.name}</td>
                      <td className="px-8 py-5 text-slate-500 text-sm">{user.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <select 
                          value={user.role}
                          disabled={user.email === 'charlesmkonyi87@gmail.com'}
                          onChange={(e) => handleUpdateRole(user.id!, e.target.value as UserRole)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="bursar">Bursar</option>
                          <option value="lecturer">Lecturer</option>
                          <option value="registrar">Registrar</option>
                          <option value="other">Other</option>
                          <option value="student">Student</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="max-w-3xl space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-white">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Upload Student Results</h3>
                  <p className="text-slate-500 text-sm">Select a student and enter their academic performance.</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleUploadResult}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Select Student</label>
                  <select 
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                  >
                    <option value="">Select a student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.registrationNumber})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Course Name</label>
                    <input 
                      required
                      type="text" 
                      value={resultForm.courseName}
                      onChange={(e) => setResultForm({...resultForm, courseName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                      placeholder="e.g. Anatomy I" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Course Code</label>
                    <input 
                      required
                      type="text" 
                      value={resultForm.courseCode}
                      onChange={(e) => setResultForm({...resultForm, courseCode: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                      placeholder="e.g. CM 101" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Grade</label>
                    <input 
                      required
                      type="text" 
                      value={resultForm.grade}
                      onChange={(e) => setResultForm({...resultForm, grade: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                      placeholder="e.g. A" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Semester</label>
                    <select 
                      required
                      value={resultForm.semester}
                      onChange={(e) => setResultForm({...resultForm, semester: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Academic Year</label>
                    <input 
                      required
                      type="text" 
                      value={resultForm.year}
                      onChange={(e) => setResultForm({...resultForm, year: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                      placeholder="e.g. 2024/2025" 
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                    <span>{uploading ? 'Uploading...' : 'Submit Results'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'timetables' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <form onSubmit={handleAddTimetable} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Add Timetable</h3>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Program</label>
                  <select 
                    value={timetableForm.program}
                    onChange={(e) => setTimetableForm({...timetableForm, program: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                  >
                    <option value="Clinical Medicine">Clinical Medicine</option>
                    <option value="Clinical Radiology">Clinical Radiology</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Year</label>
                  <input 
                    type="text" 
                    required
                    value={timetableForm.year}
                    onChange={(e) => setTimetableForm({...timetableForm, year: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                    placeholder="e.g. 2024/2025" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Semester</label>
                  <select 
                    value={timetableForm.semester}
                    onChange={(e) => setTimetableForm({...timetableForm, semester: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Document URL</label>
                  <input 
                    type="url" 
                    required
                    value={timetableForm.fileUrl}
                    onChange={(e) => setTimetableForm({...timetableForm, fileUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                    placeholder="https://..." 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                  Upload Timetable
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Active Timetables</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {timetables.map((tt, idx) => (
                  <div key={idx} className="p-8 flex items-start justify-between group">
                    <div className="flex items-start space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <Calendar className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{tt.program}</h4>
                        <p className="text-slate-500 text-sm mt-1">{tt.year} - {tt.semester}</p>
                        <a href={tt.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold mt-2 inline-block hover:underline">View Document</a>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteTimetable(tt.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {timetables.length === 0 && (
                  <div className="p-12 text-center text-slate-500">No timetables uploaded yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center text-white">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{editingAnnouncement ? 'Edit Announcement' : 'Post Announcement'}</h3>
                  <p className="text-slate-500 text-sm">Share news, exam dates, or notices with students.</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleAddAnnouncement}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    required
                    type="text" 
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all" 
                    placeholder="e.g. End of Semester Exams" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Type</label>
                  <select 
                    required
                    value={announcementForm.category}
                    onChange={(e) => setAnnouncementForm({...announcementForm, category: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all appearance-none"
                  >
                    <option value="notice">Notice</option>
                    <option value="exam">Exam</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none" 
                    placeholder="Enter announcement details..." 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">File URL (Optional)</label>
                  <input 
                    type="url" 
                    value={announcementForm.fileUrl}
                    onChange={(e) => setAnnouncementForm({...announcementForm, fileUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all" 
                    placeholder="https://example.com/document.pdf" 
                  />
                </div>
                <div className="flex space-x-4">
                  {editingAnnouncement && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingAnnouncement(null);
                        setAnnouncementForm({ title: '', content: '', category: 'notice' });
                      }}
                      className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 px-8 py-4 rounded-xl text-lg font-bold transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="flex-1 bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-purple-200 active:scale-95"
                  >
                    {editingAnnouncement ? 'Save Changes' : 'Post Announcement'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">All Announcements</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {announcements.map((ann, idx) => (
                  <div key={idx} className="p-8 flex items-start justify-between group">
                    <div className="flex items-start space-x-4">
                      <div className="bg-slate-100 p-3 rounded-xl">
                        <Megaphone className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{ann.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{ann.content}</p>
                        {ann.fileUrl && (
                          <a href={ann.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold mt-2 inline-block hover:underline">
                            View Attached File
                          </a>
                        )}
                        <div className="flex items-center space-x-4 mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{ann.category}</span>
                          <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingAnnouncement(ann);
                          setAnnouncementForm({ title: ann.title, content: ann.content, category: ann.category, fileUrl: ann.fileUrl || '' });
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit Announcement"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex h-[800px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
              <div className="p-6 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-bold text-slate-900">Messages</h3>
                <p className="text-slate-500 text-sm mt-1">Chat with students and staff.</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No conversations yet.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {conversations.map((conv) => (
                      <button
                        key={conv.user.id}
                        onClick={() => setSelectedUserId(conv.user.id)}
                        className={`w-full text-left p-4 flex items-center space-x-4 hover:bg-white transition-colors ${selectedUserId === conv.user.id ? 'bg-white border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                          {conv.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-slate-900 truncate">{conv.user.name}</h4>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                              {new Date(conv.lastMessageAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 truncate">
                            {conv.messages[conv.messages.length - 1].subject}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {conv.unreadCount}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedConversation ? (
                <>
                  <div className="p-6 border-b border-slate-100 flex items-center space-x-4 bg-white shadow-sm z-10">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {selectedConversation.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{selectedConversation.user.name}</h3>
                      <p className="text-xs text-slate-500">Student</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {selectedConversation.messages.map((msg) => (
                      <div key={msg.id} className="space-y-4">
                        {/* User Message */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-1">
                            {selectedConversation.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
                            <h5 className="font-bold text-slate-900 text-sm mb-1">{msg.subject}</h5>
                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{msg.content}</p>
                            <div className="text-[10px] text-slate-400 mt-2 text-right">
                              {new Date(msg.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Admin Reply */}
                        {msg.reply ? (
                          <div className="flex items-start space-x-3 justify-end">
                            <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                              <p className="text-sm whitespace-pre-wrap">{msg.reply}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                              A
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end pl-12">
                            <form 
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const replyContent = (form.elements.namedItem('reply') as HTMLTextAreaElement).value;
                                if (!replyContent) return;
                                
                                try {
                                  await updateDoc(doc(db, 'messages', msg.id!), {
                                    reply: replyContent,
                                    isRead: true
                                  });
                                  form.reset();
                                } catch (err) {
                                  console.error('Error replying:', err);
                                  setMessage({ type: 'error', text: 'Failed to send reply.' });
                                }
                              }}
                              className="w-full max-w-[80%] bg-white border border-slate-200 rounded-2xl p-3 shadow-sm"
                            >
                              <textarea
                                name="reply"
                                required
                                placeholder={`Reply to "${msg.subject}"...`}
                                className="w-full bg-transparent text-sm focus:outline-none resize-none"
                                rows={2}
                              />
                              <div className="flex justify-end mt-2">
                                <button 
                                  type="submit"
                                  className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                                >
                                  Send Reply
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
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
                  <h3 className="text-2xl font-bold text-slate-900">Admin Settings</h3>
                  <p className="text-slate-500 text-sm">Manage system preferences and configurations.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <div className="font-bold text-slate-900">Email Notifications</div>
                    <div className="text-sm text-slate-500">Receive updates about new registrations.</div>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <div className="font-bold text-slate-900">System Maintenance Mode</div>
                    <div className="text-sm text-slate-500">Temporarily disable student access.</div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <div className="font-bold text-slate-900">Auto-Approve Students</div>
                    <div className="text-sm text-slate-500">Automatically approve new student signups.</div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <button className="text-red-600 font-bold text-sm hover:underline">
                  Clear System Cache
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Add New Student</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={addStudentForm.name}
                    onChange={(e) => setAddStudentForm({...addStudentForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Registration Number</label>
                  <input 
                    type="text" 
                    required
                    value={addStudentForm.registrationNumber}
                    onChange={(e) => setAddStudentForm({...addStudentForm, registrationNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="NS0108/0021/2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Program</label>
                  <select 
                    value={addStudentForm.program}
                    onChange={(e) => setAddStudentForm({...addStudentForm, program: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="Clinical Medicine">Clinical Medicine</option>
                    <option value="Clinical Radiology">Clinical Radiology</option>
                  </select>
                </div>
                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Student</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Edit User Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSaveUserEdit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Registration Number</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.registrationNumber}
                    onChange={(e) => setEditingUser({...editingUser, registrationNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Program</label>
                  <select 
                    value={editingUser.program}
                    onChange={(e) => setEditingUser({...editingUser, program: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="Clinical Medicine">Clinical Medicine</option>
                    <option value="Clinical Radiology">Clinical Radiology</option>
                  </select>
                </div>
                {(isBursar || isAdmin) && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Fees Remaining (TZS)</label>
                    <input 
                      type="number" 
                      value={editingUser.feesRemaining || 0}
                      onChange={(e) => setEditingUser({...editingUser, feesRemaining: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                )}
                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {approvalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Approve Account</h3>
                <button onClick={() => setApprovalUser(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-slate-600">
                  Are you sure you want to approve the account for <strong>{approvalUser.name}</strong>?
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Assign Role</label>
                  <select 
                    value={approvalRole}
                    onChange={(e) => setApprovalRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="bursar">Bursar</option>
                    <option value="registrar">Registrar</option>
                    <option value="admin">Administrator</option>
                    <option value="editor">Editor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setApprovalUser(null)}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center space-x-2"
                  >
                    <UserCheck className="h-5 w-5" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Reject Account</h3>
                <button onClick={() => setRejectUser(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <p className="text-sm font-medium">
                    Are you sure you want to reject and delete the registration for <strong>{rejectUser.name}</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setRejectUser(null)}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleReject}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center space-x-2"
                  >
                    <UserX className="h-5 w-5" />
                    <span>Reject & Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload File Modal */}
      <AnimatePresence>
        {uploadFileModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Upload File</h3>
                <button onClick={() => setUploadFileModalUser(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleUploadStudentFile} className="p-8 space-y-6">
                <p className="text-slate-600 text-sm">
                  Upload a file to <strong>{uploadFileModalUser.name}</strong>'s profile.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">File Name / Description</label>
                  <input 
                    type="text" 
                    required
                    value={studentFileForm.fileName}
                    onChange={(e) => setStudentFileForm({...studentFileForm, fileName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="e.g. Medical Certificate"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">File URL</label>
                  <input 
                    type="url" 
                    required
                    value={studentFileForm.fileUrl}
                    onChange={(e) => setStudentFileForm({...studentFileForm, fileUrl: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setUploadFileModalUser(null)}
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
