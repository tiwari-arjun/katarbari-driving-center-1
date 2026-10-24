import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut, 
  Search, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Save, 
  RefreshCw, 
  Eye, 
  Menu, 
  X, 
  ExternalLink,
  Shield,
  CreditCard,
  TrendingUp,
  Tag
} from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';

interface AdminDashboardProps {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
  onBackToSite: () => void;
}

export default function AdminDashboard({ token, admin, onLogout, onBackToSite }: AdminDashboardProps) {
  const { t, i18n } = useTranslation();
  const isNepali = (i18n.language || 'en').startsWith('ne');

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'enquiries' | 'analytics' | 'settings'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [enquiriesList, setEnquiriesList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Student filters
  const [studentSearch, setStudentSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enquiry filters
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');

  // Course editing state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editedCourseForm, setEditedCourseForm] = useState<any>({});

  // Password change form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Load active tab data
  useEffect(() => {
    fetchTabData();
  }, [activeTab, token]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const fetchTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setOverviewData(await res.json());
      } else if (activeTab === 'students') {
        const params = new URLSearchParams();
        if (studentSearch) params.append('search', studentSearch);
        if (courseFilter !== 'all') params.append('course', courseFilter);
        if (statusFilter !== 'all') params.append('status', statusFilter);

        const res = await fetch(`/api/admin/students?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setStudentsList(await res.json());
      } else if (activeTab === 'courses') {
        const res = await fetch('/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setCoursesList(await res.json());
      } else if (activeTab === 'enquiries') {
        const params = new URLSearchParams();
        if (enquiryStatusFilter !== 'all') params.append('status', enquiryStatusFilter);

        const res = await fetch(`/api/admin/enquiries?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setEnquiriesList(await res.json());
      } else if (activeTab === 'analytics') {
        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setAnalyticsData(await res.json());
      }
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Student status update
  const handleUpdateStudent = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        showNotification('Student record updated successfully');
        fetchTabData();
      }
    } catch (e) {
      showNotification('Failed to update student', 'error');
    }
  };

  // Enquiry status update
  const handleUpdateEnquiry = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        showNotification('Enquiry updated');
        fetchTabData();
      }
    } catch (e) {
      showNotification('Failed to update enquiry', 'error');
    }
  };

  // Save course edits
  const handleSaveCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedCourseForm)
      });
      if (res.ok) {
        showNotification('Course pricing and details updated!');
        setEditingCourseId(null);
        fetchTabData();
      }
    } catch (e) {
      showNotification('Failed to update course', 'error');
    }
  };

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('Password changed successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showNotification(data.error || 'Password update failed', 'error');
      }
    } catch (e) {
      showNotification('Error changing password', 'error');
    }
  };

  // CSV Export download trigger
  const handleExportCSV = () => {
    window.location.href = `/api/admin/students/export-csv?token=${token}`;
  };

  const navItems = [
    { id: 'overview', labelEn: 'Overview', labelNe: 'ड्यासबोर्ड सारांश', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'students', labelEn: 'Student Management', labelNe: 'विद्यार्थी व्यवस्थापन', icon: <Users className="w-5 h-5" /> },
    { id: 'courses', labelEn: 'Course Pricing & Info', labelNe: 'कोर्स र शुल्क व्यवस्थापन', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'enquiries', labelEn: 'Website Enquiries', labelNe: 'अनलाइन सोधपुछहरू', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'analytics', labelEn: 'Exam & Eye Analytics', labelNe: 'लिखित तथा आँखा एनालिटिक्स', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', labelEn: 'Admin Settings', labelNe: 'प्रशासक सेटिङ', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800 font-sans">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-slate-900 text-slate-300 border-r border-slate-800 p-6 flex-shrink-0">
        
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md">
            K
          </div>
          <div>
            <span className="font-black text-white text-base tracking-tight block">Katarbari Admin</span>
            <span className="text-[11px] text-brand-400 font-bold uppercase tracking-wider block font-ne">
              वालिङ, स्याङ्जा • Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer font-ne ${
                activeTab === item.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{isNepali ? item.labelNe : item.labelEn}</span>
            </button>
          ))}
        </nav>

        {/* Admin profile and logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="px-3 py-2 bg-slate-800/80 rounded-xl">
            <div className="text-xs font-bold text-white truncate">{admin.name || admin.email}</div>
            <div className="text-[10px] text-emerald-400 uppercase font-semibold">Authorized: {admin.role}</div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBackToSite}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer font-ne"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isNepali ? "वेबसाइट" : "Public Site"}</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="py-2 px-3 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/50 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer font-ne"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isNepali ? "बाहिरिने" : "Sign Out"}</span>
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm">Katarbari Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-red-400 hover:text-red-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="lg:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id as any);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold font-ne ${
                activeTab === item.id ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{isNepali ? item.labelNe : item.labelEn}</span>
            </button>
          ))}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onBackToSite}
              className="flex-1 py-2 bg-slate-800 text-xs font-bold rounded-lg text-center"
            >
              Public Website
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="py-2 px-4 bg-red-900/80 text-red-200 text-xs font-bold rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-ne">
              {navItems.find(i => i.id === activeTab)?.[isNepali ? 'labelNe' : 'labelEn']}
            </h1>
            <p className="text-xs text-slate-500 font-ne">
              Katarbari Driving Center • Syangja • Private Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchTabData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Toast feedback banner */}
        {feedbackMsg && (
          <div className={`mx-6 mt-4 p-4 rounded-2xl flex items-center gap-3 text-sm font-ne ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' 
              : 'bg-red-50 border border-red-300 text-red-950'
          }`}>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && overviewData && (
            <div className="space-y-8">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider font-ne">Total Students</span>
                    <Users className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{overviewData.totalStudents}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">✓ Verified in database</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider font-ne">New Enquiries</span>
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-3xl font-black text-amber-600">{overviewData.newEnquiries}</div>
                  <div className="text-xs text-slate-500 mt-1">{overviewData.totalEnquiries} total inquiries logged</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider font-ne">Completed Payments</span>
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-emerald-700">Rs. {overviewData.totalRevenue?.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1">{overviewData.completedPayments} students paid</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider font-ne">Pending Payments</span>
                    <Clock className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="text-3xl font-black text-rose-600">{overviewData.pendingPayments}</div>
                  <div className="text-xs text-rose-600 font-semibold mt-1">Awaiting trial fees</div>
                </div>
              </div>

              {/* Course-wise registration breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-ne">
                  {isNepali ? "कोर्सअनुसार दर्ता विवरण" : "Course-wise Registrations & Intake"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(overviewData.courseStats || {}).map(([key, item]: any) => (
                    <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                        <span className="text-xs font-black bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">
                          {item.count} Students
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Collected Revenue: <strong className="text-slate-800">Rs. {item.revenue?.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Students Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 font-ne">
                    {isNepali ? "भर्खरै दर्ता भएका विद्यार्थीहरू" : "Recent Registrations"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="text-xs font-bold text-brand-700 hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Course</th>
                        <th className="py-3 px-4">Shift</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(overviewData.recentStudents || []).map((s: any) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {s.fullName}
                            <span className="block text-xs font-normal text-slate-500">{s.phone}</span>
                          </td>
                          <td className="py-3 px-4">{s.courseName}</td>
                          <td className="py-3 px-4 text-xs">{s.shift}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                              s.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STUDENT MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              
              {/* Filters & Export Bar */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search by student name or phone..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchTabData()}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="all">All Courses</option>
                    <option value="car">Car (Category B)</option>
                    <option value="scooter">Scooter (Category K)</option>
                    <option value="motorcycle">Motorbike (Category A)</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_training">In Training</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    type="button"
                    onClick={fetchTabData}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Filter
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-700">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Reg ID</th>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Course & Fee</th>
                        <th className="py-3.5 px-4">Shift</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Training Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 font-ne">
                            कुनै विद्यार्थी फेला परेन (No records found matching filters).
                          </td>
                        </tr>
                      ) : (
                        studentsList.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4 font-mono text-xs font-bold text-brand-700">{s.id}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 block">{s.fullName}</span>
                              <span className="text-xs text-slate-500">{s.phone}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block text-xs">{s.courseName}</span>
                              <span className="text-xs text-emerald-700 font-bold">Rs. {s.feeAmount?.toLocaleString()}</span>
                            </td>
                            <td className="py-3.5 px-4 text-xs">{s.shift}</td>
                            <td className="py-3.5 px-4">
                              <select
                                value={s.paymentStatus}
                                onChange={(e) => handleUpdateStudent(s.id, { paymentStatus: e.target.value })}
                                className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                                  s.paymentStatus === 'completed' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Paid (Full)</option>
                                <option value="partial">Partial</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={s.status}
                                onChange={(e) => handleUpdateStudent(s.id, { status: e.target.value })}
                                className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                                  s.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : s.status === 'confirmed' || s.status === 'in_training'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_training">In Training</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  const note = prompt('Update student notes:', s.notes || '');
                                  if (note !== null) handleUpdateStudent(s.id, { notes: note });
                                }}
                                className="text-xs font-bold text-slate-600 hover:text-brand-700 underline cursor-pointer"
                              >
                                Notes
                              </button>
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

          {/* TAB 3: COURSE MANAGEMENT */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-900 flex items-start gap-2.5 font-ne">
                <Tag className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{isNepali ? "कोर्स तथा शुल्क व्यवस्थापन:" : "Course Pricing Management:"}</strong>{' '}
                  {isNepali 
                    ? "यहाँबाट परिवर्तन गरिएका शुल्क र विवरणहरू तत्काल वेबसाइटको मुख्य पृष्ठ र भर्ना फारममा लागू हुन्छन्।"
                    : "Prices and descriptions updated here are stored in the server database and immediately reflected on the live public website."}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coursesList.map(c => {
                  const isEditing = editingCourseId === c.id;
                  return (
                    <div key={c.id} className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                      {isEditing ? (
                        <div className="space-y-4">
                          <h4 className="font-bold text-base text-slate-900">Editing: {c.nameEn}</h4>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price EN (e.g. Rs. 12,000)</label>
                            <input
                              type="text"
                              value={editedCourseForm.priceEn || ''}
                              onChange={(e) => setEditedCourseForm({ ...editedCourseForm, priceEn: e.target.value })}
                              className="w-full p-2 border rounded-xl text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price NE (e.g. रु. १२,०००)</label>
                            <input
                              type="text"
                              value={editedCourseForm.priceNe || ''}
                              onChange={(e) => setEditedCourseForm({ ...editedCourseForm, priceNe: e.target.value })}
                              className="w-full p-2 border rounded-xl text-sm font-ne"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Numeric Value (NPR)</label>
                            <input
                              type="number"
                              value={editedCourseForm.priceValue || 0}
                              onChange={(e) => setEditedCourseForm({ ...editedCourseForm, priceValue: parseInt(e.target.value) || 0 })}
                              className="w-full p-2 border rounded-xl text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={editedCourseForm.descriptionEn || ''}
                              onChange={(e) => setEditedCourseForm({ ...editedCourseForm, descriptionEn: e.target.value })}
                              className="w-full p-2 border rounded-xl text-xs"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleSaveCourse(c.id)}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCourseId(null)}
                              className="px-3 py-2 border rounded-xl text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                              {c.vehicleType}
                            </span>
                            <span className={`w-2.5 h-2.5 rounded-full ${c.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          </div>

                          <h3 className="text-xl font-black text-slate-900 mb-1">{c.nameEn}</h3>
                          <p className="text-xs font-ne text-slate-500 mb-4">{c.nameNe}</p>

                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Official Price</span>
                            <div className="text-2xl font-black text-brand-700">{c.priceEn}</div>
                            <div className="text-sm font-ne text-slate-600">{c.priceNe}</div>
                          </div>

                          <p className="text-xs text-slate-600 mb-4">{c.descriptionEn}</p>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingCourseId(c.id);
                              setEditedCourseForm({ ...c });
                            }}
                            className="w-full py-2.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Course & Price</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['all', 'new', 'contacted', 'resolved'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEnquiryStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                        enquiryStatusFilter === st ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enquiriesList.map(e => (
                  <div key={e.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-base">{e.fullName}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        e.status === 'new' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {e.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Phone: <a href={`tel:${e.phone}`} className="text-brand-700 font-bold hover:underline">{e.phone}</a></div>
                      <div>Interest: <strong>{e.courseInterest}</strong></div>
                      {e.message && <div className="p-3 bg-slate-50 rounded-xl mt-2 italic text-slate-700">"{e.message}"</div>}
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">{new Date(e.createdAt).toLocaleString()}</span>
                      <select
                        value={e.status}
                        onChange={(ev) => handleUpdateEnquiry(e.id, { status: ev.target.value })}
                        className="text-xs font-semibold py-1 px-2 border rounded-lg"
                      >
                        <option value="new">Mark New</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="enrolled">Mark Enrolled</option>
                        <option value="resolved">Mark Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRACTICE & EYE-TEST ANALYTICS */}
          {activeTab === 'analytics' && analyticsData && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Mock Test Runs</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">{analyticsData.totalAttempts}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Average Score</span>
                  <div className="text-3xl font-black text-brand-700 mt-1">{analyticsData.avgScore}%</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase">Pass Rate (70% Target)</span>
                  <div className="text-3xl font-black text-emerald-600 mt-1">{analyticsData.passRate}%</div>
                </div>
              </div>

              {/* Questions most commonly missed */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-ne">
                  {isNepali ? "विद्यार्थीहरूले धेरै गल्ती गर्ने प्रश्नहरू (Most Missed Questions)" : "Most Frequently Missed Questions"}
                </h3>
                
                <div className="space-y-2.5">
                  {(analyticsData.mostMissedQuestions || []).length === 0 ? (
                    <p className="text-sm text-slate-400">No question errors logged yet.</p>
                  ) : (
                    analyticsData.mostMissedQuestions.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-red-50/60 border border-red-200/60 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-red-900">Question ID: {item.questionId}</span>
                        <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-full font-bold">
                          Missed {item.count} times
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Eye Test Analytics */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-ne">
                  {isNepali ? "आँखा परीक्षण अभ्यास गतिविधि (Eye Test Activity)" : "Eye Test Practice Activity"}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Total student eye-test sessions: {analyticsData.eyeTestStats?.totalAttempts || 0} • Average Accuracy: {analyticsData.eyeTestStats?.avgScore || 0}%
                </p>
              </div>

            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Administrator Account Settings</h3>
                <p className="text-xs text-slate-500">Logged in as {admin.email} (Role: {admin.role})</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-bold text-slate-800">Change Admin Password</h4>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">New Password (Min 8 chars)</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full p-2.5 border rounded-xl text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              <div className="pt-6 border-t text-xs text-slate-500 space-y-1">
                <div>Server Storage: <strong>Local Persistent JSON Database (`data/katarbari_db.json`)</strong></div>
                <div>Database Encryption: <strong>PBKDF2 SHA-512 with per-account cryptographically random salts</strong></div>
                <div>Server Environment: <strong>Express Full-Stack Architecture on Port 3000</strong></div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
