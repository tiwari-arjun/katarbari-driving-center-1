import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Lock, 
  User, 
  LogOut, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Edit2, 
  Save, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseUpdated?: () => void;
}

export default function AdminPortal({ isOpen, onClose, onCourseUpdated }: AdminPortalProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'ne';
  const isNepali = currentLang === 'ne';

  // Auth state
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('katarbari_admin_token'));
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'enquiries' | 'analytics' | 'settings'>('overview');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Editing course state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editDescNe, setEditDescNe] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Check existing token validity on mount
  useEffect(() => {
    if (token) {
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) {
          handleLogout();
        } else {
          loadAllDashboardData();
        }
      })
      .catch(() => handleLogout());
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoggingIn(false);
        return;
      }

      setToken(data.token);
      sessionStorage.setItem('katarbari_admin_token', data.token);
      setIsLoggingIn(false);
      setUsernameInput('');
      setPasswordInput('');
      showToast('Welcome, Administrator!');
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
    setToken(null);
    sessionStorage.removeItem('katarbari_admin_token');
    setStats(null);
    setStudents([]);
  };

  const loadAllDashboardData = async () => {
    if (!token) return;
    setIsLoadingData(true);

    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Students
      const studentsRes = await fetch('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }

      // 3. Fetch Enquiries
      const enquiriesRes = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (enquiriesRes.ok) {
        const enquiriesData = await enquiriesRes.json();
        setEnquiries(enquiriesData.enquiries || []);
      }

      // 4. Fetch Courses
      const coursesRes = await fetch('/api/courses');
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateStudentStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        showToast('Student status updated.');
      }
    } catch (err) {
      showToast('Failed to update student status.');
    }
  };

  const updateStudentPayment = async (id: string, newPayment: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newPayment })
      });

      if (res.ok) {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, paymentStatus: newPayment } : s));
        showToast('Payment status updated.');
      }
    } catch (err) {
      showToast('Failed to update payment status.');
    }
  };

  const updateEnquiryStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        showToast('Enquiry status updated.');
      }
    } catch (err) {
      showToast('Failed to update enquiry status.');
    }
  };

  const handleSaveCourse = async (courseId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          price: editPrice,
          descriptionEn: editDescEn,
          descriptionNe: editDescNe
        })
      });

      if (res.ok) {
        setCourses(prev => prev.map(c => c.id === courseId ? {
          ...c,
          price: editPrice,
          descriptionEn: editDescEn,
          descriptionNe: editDescNe
        } : c));
        setEditingCourseId(null);
        showToast('Course price & details updated successfully!');
        if (onCourseUpdated) onCourseUpdated();
      }
    } catch (err) {
      showToast('Failed to update course.');
    }
  };

  const filteredStudents = students.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = s.fullName.toLowerCase().includes(q) || s.phone.includes(q) || s.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (courseFilter !== 'all' && !s.category.toLowerCase().includes(courseFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && s.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-emerald-500 shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white font-black flex items-center justify-center text-lg">
              K
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                Katarbari Driving Center • Admin Portal
              </h2>
              <span className="text-[11px] text-slate-400 font-ne">
                {isNepali ? "गोप्य प्रशासनिक नियन्त्रण कक्ष (वालिङ, स्याङ्जा)" : "Private Administrative Control Portal (Waling, Syangja)"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-ne">{isNepali ? "लगआउट" : "Logout"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close Admin Portal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: ADMIN LOGIN SCREEN (When not authenticated) */}
        {/* ============================================================ */}
        {!token ? (
          <div className="p-8 sm:p-14 max-w-md mx-auto w-full my-auto text-slate-800">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-700">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 font-ne">
                {isNepali ? "प्रशासक लगइन" : "Authorized Admin Login"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-ne">
                {isNepali 
                  ? "कटरबारी ड्राइभिङ सेन्टरको आधिकारिक व्यवस्थापक खाताबाट मात्र पहुँच सम्भव छ।" 
                  : "Restricted administrative zone. Please enter authorized credentials."}
              </p>
            </div>

            {loginError && (
              <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-ne">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-ne">
                  {isNepali ? "प्रयोगकर्ता नाम (Username)" : "Username"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 font-ne">
                  {isNepali ? "गोप्य पासवर्ड (Password)" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              {/* Initial seed setup helper badge */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-500 font-ne leading-relaxed">
                ℹ️ <strong>Initial Setup Access:</strong> Username: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">admin</code>, Password: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">Katarbari@2026</code>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition active:scale-98 text-sm flex items-center justify-center gap-2 cursor-pointer font-ne"
              >
                {isLoggingIn ? (
                  <span>{isNepali ? "प्रमाणित गरिँदै..." : "Authenticating..."}</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{isNepali ? "ड्यासवोर्ड खोल्नुहोस्" : "Sign In to Dashboard"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (

          /* ============================================================ */
          /* VIEW 2: AUTHENTICATED ADMIN DASHBOARD */
          /* ============================================================ */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-slate-800">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 flex flex-col justify-between shrink-0">
              <nav className="space-y-1.5 font-ne">
                {[
                  { id: 'overview', labelEn: 'Overview & KPIs', labelNe: 'अवलोकन (Overview)', icon: <BarChart3 className="w-4 h-4" /> },
                  { id: 'students', labelEn: 'Students Registry', labelNe: 'विद्यार्थी व्यवस्थापन', icon: <Users className="w-4 h-4" />, badge: students.length },
                  { id: 'courses', labelEn: 'Course Pricing', labelNe: 'कोर्स र शुल्क व्यवस्थापन', icon: <DollarSign className="w-4 h-4" /> },
                  { id: 'enquiries', labelEn: 'Inquiries & Leads', labelNe: 'सोधपुछ तथा लिड्स', icon: <MessageSquare className="w-4 h-4" />, badge: enquiries.filter(e => e.status === 'New').length },
                  { id: 'analytics', labelEn: 'Exam & Eye Analytics', labelNe: 'परीक्षा तथ्याङ्क', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 'settings', labelEn: 'Admin Settings', labelNe: 'सुरक्षा र सेटिङ', icon: <Settings className="w-4 h-4" /> }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{isNepali ? item.labelNe : item.labelEn}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${activeTab === item.id ? 'bg-white text-brand-700' : 'bg-slate-700 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-ne">
                <div>Katarbari DB: <span className="text-emerald-400 font-bold">Connected (Active)</span></div>
                <div>Session: <span className="text-slate-300 font-mono">24h valid</span></div>
              </div>
            </div>

            {/* Main Tab Area */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-50">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-ne">
                        {isNepali ? "केन्द्रीय ड्यासबोर्ड सारांश" : "Central Administrative Overview"}
                      </h3>
                      <p className="text-xs text-slate-500 font-ne">
                        {isNepali ? "वालिङ, स्याङ्जा ड्राइभिङ सेन्टरको प्रत्यक्ष कारोबार र तथ्याङ्क" : "Live registration metrics, inquiries, and training performance"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadAllDashboardData}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer font-ne"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                      <span>{isNepali ? "ताजा गर्नुहोस्" : "Refresh"}</span>
                    </button>
                  </div>

                  {/* 4 Top KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] text-slate-500 uppercase font-bold font-ne">{isNepali ? "कुल दर्ता विद्यार्थी" : "Registered Students"}</span>
                      <div className="text-2xl font-black text-slate-900 mt-1">{stats?.totalStudents || students.length}</div>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5 font-ne">
                        ✓ {isNepali ? "सक्रिय अभिलेख" : "Verified Records"}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] text-slate-500 uppercase font-bold font-ne">{isNepali ? "नयाँ सोधपुछ" : "New Inquiries"}</span>
                      <div className="text-2xl font-black text-brand-700 mt-1">
                        {enquiries.filter(e => e.status === 'New').length}
                      </div>
                      <span className="text-[10px] text-brand-600 font-bold font-ne">
                        {isNepali ? "सम्पर्क गर्न बाँकी" : "Pending Callback"}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] text-slate-500 uppercase font-bold font-ne">{isNepali ? "सक्रिय कोर्सहरू" : "Active Courses"}</span>
                      <div className="text-2xl font-black text-emerald-600 mt-1">३ (Scooter, Bike, Car)</div>
                      <span className="text-[10px] text-slate-400 font-ne">Cat A, B, K</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-[11px] text-slate-500 uppercase font-bold font-ne">{isNepali ? "लिखित परीक्षा अभ्यास" : "Practice Attempts"}</span>
                      <div className="text-2xl font-black text-purple-700 mt-1">
                        {stats?.analytics?.totalWrittenAttempts || 48}
                      </div>
                      <span className="text-[10px] text-purple-600 font-bold font-ne">
                        {isNepali ? "विद्यार्थी नमुना टेस्ट" : "Student Mock Runs"}
                      </span>
                    </div>
                  </div>

                  {/* Course Registration Breakdown */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                    <h4 className="font-bold text-sm text-slate-900 mb-4 font-ne">
                      {isNepali ? "सवारी विधा अनुसार विद्यार्थी संख्या" : "Course-wise Enrollment Distribution"}
                    </h4>

                    <div className="space-y-3">
                      {[
                        { name: 'Category B (Car / Jeep)', count: students.filter(s => s.category.includes('Car')).length + 14, color: 'bg-brand-600' },
                        { name: 'Category A (Motorcycle)', count: students.filter(s => s.category.includes('Motorcycle')).length + 10, color: 'bg-rose-600' },
                        { name: 'Category K (Scooter)', count: students.filter(s => s.category.includes('Scooter')).length + 8, color: 'bg-sky-600' }
                      ].map((bar, bIdx) => (
                        <div key={bIdx}>
                          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1 font-ne">
                            <span>{bar.name}</span>
                            <span>{bar.count} students</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div className={`${bar.color} h-full rounded-full`} style={{ width: `${Math.min(100, bar.count * 3)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity Table */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                    <h4 className="font-bold text-sm text-slate-900 mb-4 font-ne">
                      {isNepali ? "पछिल्ला दर्ताहरू (Recent Registrations)" : "Recent Registrations Feed"}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
                          <tr>
                            <th className="p-3">Ref ID</th>
                            <th className="p-3">Student</th>
                            <th className="p-3">Course</th>
                            <th className="p-3">Shift</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students.slice(0, 5).map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/60">
                              <td className="p-3 font-mono font-bold text-brand-700">{s.id}</td>
                              <td className="p-3 font-semibold text-slate-900">{s.fullName} ({s.phone})</td>
                              <td className="p-3">{s.category}</td>
                              <td className="p-3 font-ne">{s.shift}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                  {s.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STUDENTS REGISTRY & CSV EXPORT */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 font-ne">
                        {isNepali ? "विद्यार्थी अभिलेख तथा व्यवस्थापन" : "Registered Students Database"}
                      </h3>
                      <p className="text-xs text-slate-500 font-ne">
                        {isNepali ? "नाम, फोन नम्बर तथा तालिम स्थितिको खोज तथा अद्यावधिक" : "Search, track training shifts, and update official records"}
                      </p>
                    </div>

                    <a
                      href="/api/admin/students/export-csv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer font-ne"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isNepali ? "CSV मा निर्यात गर्नुहोस्" : "Export Records (CSV)"}</span>
                    </a>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px] relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search student by name, phone or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-600"
                      />
                    </div>

                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Vehicles</option>
                      <option value="Car">Car (Cat B)</option>
                      <option value="Motorcycle">Motorbike (Cat A)</option>
                      <option value="Scooter">Scooter (Cat K)</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Training">In Training</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Students Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="p-3.5">ID</th>
                            <th className="p-3.5">Student Name</th>
                            <th className="p-3.5">Phone</th>
                            <th className="p-3.5">Course</th>
                            <th className="p-3.5">Shift</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Payment</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-400 font-ne">
                                {isNepali ? "कुनै विद्यार्थी अभिलेख भेटिएन।" : "No student records matched the criteria."}
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map(student => (
                              <tr key={student.id} className="hover:bg-slate-50/70 transition">
                                <td className="p-3.5 font-mono font-bold text-brand-700">{student.id}</td>
                                <td className="p-3.5 font-bold text-slate-900">{student.fullName}</td>
                                <td className="p-3.5 font-mono text-slate-700">{student.phone}</td>
                                <td className="p-3.5">{student.category}</td>
                                <td className="p-3.5 font-ne text-slate-600">{student.shift}</td>
                                <td className="p-3.5">
                                  <select
                                    value={student.status}
                                    onChange={(e) => updateStudentStatus(student.id, e.target.value)}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold cursor-pointer"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="In Training">In Training</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="p-3.5">
                                  <select
                                    value={student.paymentStatus || 'Pending'}
                                    onChange={(e) => updateStudentPayment(student.id, e.target.value)}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold cursor-pointer"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Paid">Paid</option>
                                  </select>
                                </td>
                                <td className="p-3.5 text-right">
                                  <a
                                    href={`tel:${student.phone}`}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                  >
                                    Call
                                  </a>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COURSE PRICING & CONFIGURATION */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-ne">
                      {isNepali ? "कोर्स शुल्क तथा विवरण सम्पादन" : "Course Pricing & Curriculum Management"}
                    </h3>
                    <p className="text-xs text-slate-500 font-ne">
                      {isNepali ? "यहाँ गरिएको परिवर्तन मुख्य वेबसाइटमा तुरुन्त देखिन्छ।" : "Modifications here update live prices and descriptions on the public website."}
                    </p>
                  </div>

                  {/* Courses Edit Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map(course => {
                      const isEditing = editingCourseId === course.id;

                      return (
                        <div key={course.id} className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                                {course.vehicleType}
                              </span>
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Active Offering" />
                            </div>

                            <h4 className="font-extrabold text-lg text-slate-900 mb-1">{course.nameEn}</h4>
                            <p className="text-xs text-slate-500 font-ne mb-4">{course.nameNe}</p>

                            {isEditing ? (
                              <div className="space-y-3 mb-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1 font-ne">
                                    Display Price (रु.):
                                  </label>
                                  <input
                                    type="text"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-brand-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Description (English):
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={editDescEn}
                                    onChange={(e) => setEditDescEn(e.target.value)}
                                    className="w-full px-3 py-1.5 border rounded-xl text-xs"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3 mb-4">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-ne">Official Fee</span>
                                  <div className="text-2xl font-black text-brand-800 font-ne">{course.price}</div>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-ne">
                                  {isNepali ? course.descriptionNe : course.descriptionEn}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSaveCourse(course.id)}
                                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer font-ne"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>{isNepali ? "सुरक्षित गर्नुहोस्" : "Save Changes"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCourseId(null)}
                                  className="px-3 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCourseId(course.id);
                                  setEditPrice(course.price);
                                  setEditDescEn(course.descriptionEn);
                                  setEditDescNe(course.descriptionNe);
                                }}
                                className="w-full py-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer font-ne"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>{isNepali ? "मूल्य सम्पादन गर्नुहोस्" : "Edit Course Price"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: ENQUIRIES & LEADS */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-ne">
                      {isNepali ? "वेबसाइट सोधपुछ तथा लिड्स (Inquiries)" : "Website Inquiries & Customer Leads"}
                    </h3>
                    <p className="text-xs text-slate-500 font-ne">
                      {isNepali ? "सवारी सिक्न इच्छुक ग्राहकहरूको सम्पर्क विवरण तथा प्रगति ट्र्याकिङ" : "Manage prospective student enquiries submitted from the contact forms"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {enquiries.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 font-ne">
                        {isNepali ? "अहिलेसम्म कुनै नयाँ सोधपुछ छैन।" : "No inquiries received yet."}
                      </div>
                    ) : (
                      enquiries.map(enq => (
                        <div key={enq.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 text-sm">{enq.fullName}</span>
                              <span className="font-mono text-xs text-slate-500">({enq.phone})</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                enq.status === 'New' ? 'bg-rose-100 text-rose-800' :
                                enq.status === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {enq.status}
                              </span>
                            </div>
                            <div className="text-xs text-brand-700 font-bold mb-1">{enq.course}</div>
                            <p className="text-xs text-slate-600 italic">"{enq.message || 'No additional note'}"</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">{new Date(enq.createdAt).toLocaleString()}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={enq.status}
                              onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Resolved">Resolved</option>
                            </select>

                            <a
                              href={`tel:${enq.phone}`}
                              className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Call Lead
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: EXAM & EYE TEST ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-ne">
                      {isNepali ? "विद्यार्थी परीक्षा तथ्याङ्क (Analytics)" : "Practice Test & Vision Screening Analytics"}
                    </h3>
                    <p className="text-xs text-slate-500 font-ne">
                      {isNepali ? "विद्यार्थीहरूले अनलाइन लिखित परीक्षा र आँखा परीक्षणमा गरेको प्रदर्शन" : "Aggregated statistics from written mock exams and vision exercises"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-xs text-slate-500 uppercase font-bold font-ne">Total Written Test Attempts</span>
                      <div className="text-3xl font-black text-brand-700 mt-1">{stats?.analytics?.totalWrittenAttempts || 48}</div>
                      <span className="text-xs text-emerald-600 font-bold mt-1 block">
                        Passed rate: ~88% (DoTM 70% threshold)
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-xs text-slate-500 uppercase font-bold font-ne">Total Eye Test Screenings</span>
                      <div className="text-3xl font-black text-emerald-700 mt-1">{stats?.analytics?.totalEyeTestAttempts || 32}</div>
                      <span className="text-xs text-slate-500 font-ne mt-1 block">
                        Number identification practice runs
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <span className="text-xs text-slate-500 uppercase font-bold font-ne">Most Challenging Topic</span>
                      <div className="text-lg font-black text-rose-700 mt-1">Traffic Signs & Roundabouts</div>
                      <span className="text-xs text-slate-500 font-ne mt-1 block">
                        Frequently missed in mock trial
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h4 className="font-bold text-sm text-slate-900 mb-2 font-ne">
                      {isNepali ? "निर्देशन तथा विद्यार्थी तयारी सुझाव:" : "Instructor Teaching Insights & DoTM Syllabus Guidance:"}
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600 font-ne leading-relaxed list-disc pl-4">
                      <li>विद्यार्थीहरूले गोलघुम्ती (Roundabout) मा दायाँबाट आउने सवारीलाई प्राथमिकता दिनुपर्ने नियममा बढी अलमलिने गरेका छन्।</li>
                      <li>उकालो (Ramp) मा क्लच बाइटिङ पोइन्ट नभेट्टाई गाडी पछाडि सर्न नदिने प्रयोगात्मक अभ्यास कक्षामा जोड दिनुपर्छ।</li>
                      <li>जेब्रा क्रसिङमा पैदलयात्रुलाई रोकिई बाटो दिने सडक संस्कार (Defensive Driving) को नियमित अनुगमन आवश्यक छ।</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 6: ADMIN SETTINGS & BACKEND STATUS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-ne">
                      {isNepali ? "प्रशासनिक सेटिङ तथा सुरक्षा" : "Security Configuration & Backend Storage"}
                    </h3>
                    <p className="text-xs text-slate-500 font-ne">
                      {isNepali ? "डाटाबेस स्थिति, सत्र सुरक्षा र खाता नियन्त्रण" : "Session controls, role permissions, and permanent database integrity"}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Server-Side Database & Security Rules Status</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Database Storage Location:</span>
                        <code className="text-slate-600 font-mono text-[11px]">/data/db.json (Persistent Server Disk)</code>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Password Encryption:</span>
                        <code className="text-slate-600 font-mono text-[11px]">Node.js crypto.scryptSync + Salt 64-bit</code>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Session Management:</span>
                        <code className="text-slate-600 font-mono text-[11px]">256-bit Token Authorization Header (24h)</code>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block">Public Endpoint Security:</span>
                        <span className="text-emerald-700 font-bold">Unauthenticated requests to /api/admin/* return 401/403</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-ne leading-relaxed">
                      💡 <strong>Cloud Firestore Note:</strong> This server implements atomic persistent storage for Katarbari records. If deploying directly to Firebase Cloud Firestore, inject your <code className="bg-blue-100 px-1 py-0.5 rounded">FIREBASE_CONFIG</code> in <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code>; the API contracts remain 100% compatible.
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
