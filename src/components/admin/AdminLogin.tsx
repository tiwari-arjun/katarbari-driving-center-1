import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
  onBackToSite: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const { t, i18n } = useTranslation();
  const isNepali = (i18n.language || 'en').startsWith('ne');

  const [email, setEmail] = useState('admin@katarbari.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Store token securely in localStorage for persistent admin session
      localStorage.setItem('katarbari_admin_token', data.token);
      onLoginSuccess(data.token, data.admin);
    } catch (err) {
      setErrorMsg('Could not connect to authentication server. Please check connection.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-nepalCrimson/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Public Website link */}
      <div className="max-w-md w-full mx-auto mb-6">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer font-ne"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isNepali ? "सार्वजनिक वेबसाइटमा फर्कनुहोस्" : "Back to Public Website"}</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-xl border border-brand-500 mb-4">
          K
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-ne">
          {isNepali ? "कटरबारी ड्राइभिङ सेन्टर" : "Katarbari Driving Center"}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 font-ne">
          {isNepali ? "सुरक्षित प्रशासनिक पोर्टल (Authorized Admin Access)" : "Secure Administrative Portal & Dashboard"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-700/80">
          
          <div className="mb-6 p-3.5 bg-blue-950/70 border border-blue-800/60 rounded-xl text-blue-200 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="font-ne">
              {isNepali 
                ? "यो क्षेत्र अधिकृत प्रशासकहरूको लागि मात्र सुरक्षित छ। सबै लगइन प्रयासहरू सुरक्षित रूपमा रेकर्ड गरिन्छ।" 
                : "Restricted to authorized administrators. All sign-in attempts are cryptographically verified and recorded."}
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-start gap-2.5 font-ne">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-ne">
                {isNepali ? "प्रशासक इमेल (Admin Email)" : "Admin Email Address"}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@katarbari.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-ne">
                {isNepali ? "गोप्य पासवर्ड (Password)" : "Secure Password"}
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 font-ne">
                Initial key: <span className="font-mono text-slate-300">Katarbari@Waling2026</span>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer font-ne"
              >
                {isLoading ? (
                  <span>Verifying credentials…</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{isNepali ? "सुरक्षित लगइन गर्नुहोस्" : "Sign In to Admin Portal"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/80 text-center">
            <span className="text-[11px] text-slate-500 font-ne">
              Role-Based Access Control • Waling Syangja • {new Date().getFullYear()}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
