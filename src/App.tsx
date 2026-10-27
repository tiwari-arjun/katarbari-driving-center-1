import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import LanguageSwitcher from './components/LanguageSwitcher';
import QuizEngine from './components/QuizEngine';
import RegistrationAndInquiry from './components/RegistrationAndInquiry';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import TrialFieldGuide from './components/TrialFieldGuide';
import CoursesSection from './components/CoursesSection';
import EyeTestSection from './components/EyeTestSection';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { ScrollParallax, ScrollReveal, TiltCard } from './components/motion/AppleMotion';
import { ASSET_IMAGES } from './assets/assetImages';
import { 
  Car, 
  Bike, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Clock, 
  Award, 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck, 
  Lock, 
  Eye, 
  ArrowRight, 
  Shield, 
  FileText, 
  UserCheck 
} from 'lucide-react';

export default function App() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'ne';
  const isNepali = currentLang === 'ne';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<string>('Category B (Car / Jeep)');
  const [isScrolled, setIsScrolled] = useState(false);

  // Apple-inspired scroll-linked hero motion
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothHeroProgress = useSpring(heroProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.8,
    restDelta: 0.001
  });

  const heroContentY = useTransform(smoothHeroProgress, [0, 1], [0, 42]);
  const heroContentOpacity = useTransform(smoothHeroProgress, [0, 0.7, 1], [1, 0.9, 0.35]);
  const heroImageY = useTransform(smoothHeroProgress, [0, 1], [0, 65]);
  const heroImageScale = useTransform(smoothHeroProgress, [0, 1], [1.02, 0.96]);

  // Admin View State
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('katarbari_admin_token');
  });
  const [adminUser, setAdminUser] = useState<any>(null);

  // Scroll listener for sticky header elevation and micro-interactions
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verified Business Contact Details
  const PHONE_NUMBER = "9856011009";
  const WHATSAPP_NUMBER = "+9779856011009";

  // Check existing session token on mount or when switching to admin view
  useEffect(() => {
    const token = adminToken || localStorage.getItem('katarbari_admin_token');
    if (token) {
      fetch('/api/admin/session', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid && data.admin) {
            setAdminToken(token);
            setAdminUser(data.admin);
          } else {
            localStorage.removeItem('katarbari_admin_token');
            setAdminToken(null);
            setAdminUser(null);
          }
        })
        .catch(() => {});
    }
  }, [adminToken]);

  // Check URL hash for direct #admin route
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAdminLogout = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(() => {});
    }
    localStorage.removeItem('katarbari_admin_token');
    setAdminToken(null);
    setAdminUser(null);
    setViewMode('public');
    window.location.hash = '';
  };

  // If Admin View is active
  if (viewMode === 'admin') {
    if (adminToken && adminUser) {
      return (
        <AdminDashboard
          token={adminToken}
          admin={adminUser}
          onLogout={handleAdminLogout}
          onBackToSite={() => {
            setViewMode('public');
            window.location.hash = '';
          }}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={(token, admin) => {
          setAdminToken(token);
          setAdminUser(admin);
        }}
        onBackToSite={() => {
          setViewMode('public');
          window.location.hash = '';
        }}
      />
    );
  }

  // PUBLIC WEBSITE VIEW
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-red-600 selection:text-white">
      
      {/* 1. TOP NOTICE & UTILITY BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-ne">
                {isNepali ? "वालिङ नगरपालिका-११, स्याङ्जा (Waling-11, Syangja)" : "Waling-11, Syangja, Gandaki Province, Nepal"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-1.5 text-slate-200 hover:text-white transition font-medium">
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span>{PHONE_NUMBER}</span>
            </a>

            <span className="text-slate-700">|</span>

            {/* Admin Portal link */}
            <button
              type="button"
              onClick={() => {
                setViewMode('admin');
                window.location.hash = '#admin';
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition cursor-pointer font-ne"
              title="Staff authorization portal"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{isNepali ? "प्रशासक लगइन" : "Staff Portal"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR - TOP BAR CONTRACT */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ease-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/90' 
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl tracking-tighter group-hover:bg-red-600 transition-colors duration-300 shadow-xs">
              K
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">
                KATARBARI
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Driving Center • Waling, Syangja
              </span>
            </div>
          </a>

          {/* Clean Desktop Navigation Links with animated micro-interaction underlines */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {[
              { href: '#about', label: t('nav.about') },
              { href: '#courses', label: t('nav.courses') },
              { href: '#trial-field', label: t('nav.trialTrack') },
              { href: '#practice-test', label: t('nav.practice') },
              { href: '#eye-test', label: t('nav.eyeTest') },
              { href: '#register', label: t('nav.contact') }
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 hover:text-slate-950 transition-colors duration-200 font-ne group cursor-pointer"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 rounded-full transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Cluster: Language Switcher + Enquire Now CTA */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <a
              href="#register"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-xs hover:shadow-md font-ne cursor-pointer"
            >
              {isNepali ? "भर्ना / सोधपुछ" : "Enquire Now"}
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Smooth AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 overflow-hidden shadow-lg"
            >
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                {t('nav.about')}
              </a>
              <a 
                href="#courses" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                {t('nav.courses')}
              </a>
              <a 
                href="#trial-field" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                {t('nav.trialTrack')}
              </a>
              <a 
                href="#practice-test" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                {t('nav.practice')}
              </a>
              <a 
                href="#eye-test" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                {t('nav.eyeTest')}
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                FAQ
              </a>
              <a 
                href="#register" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors font-ne"
              >
                {t('nav.contact')}
              </a>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="#courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-lg text-sm font-ne transition-all shadow-xs"
                >
                  {t('hero.ctaClasses')}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setViewMode('admin');
                    window.location.hash = '#admin';
                  }}
                  className="w-full text-center py-2 text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                >
                  Staff Portal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        
        {/* 3. HERO SECTION - ASYMMETRIC EDITORIAL SPLIT WITH SCROLL-LINKED PARALLAX */}
        <section ref={heroRef} className="bg-slate-50 border-b border-slate-200 py-16 sm:py-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Authentic Brand Typography & CTAs with smooth scroll-linked drift */}
              <motion.div 
                style={{ y: heroContentY, opacity: heroContentOpacity }}
                className="lg:col-span-7 space-y-6 will-change-transform"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.05
                    }
                  }
                }}
              >
                
                {/* Clean tracking label with local SEO context */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-red-600 uppercase font-ne"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  <span>{isNepali ? "वालिङ-११, स्याङ्जा • कटरबारी ड्राइभिङ सेन्टर" : "Waling-11, Syangja • Katarbari Driving Center"}</span>
                </motion.div>

                {/* Primary H1 for Local SEO */}
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-ne"
                >
                  {isNepali ? (
                    <>वालिङ, स्याङ्जामा <span className="text-red-600">सुरक्षित ड्राइभिङ</span> तालिम।</>
                  ) : (
                    <>Professional <span className="text-red-600">Driving Training</span> in Waling, Syangja.</>
                  )}
                </motion.h1>

                {/* Editorial Subheadline */}
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="text-base sm:text-lg text-slate-600 font-ne leading-relaxed max-w-2xl"
                >
                  {isNepali 
                    ? "वालिङ नगरपालिका-११, स्याङ्जामा दक्ष प्रशिक्षकहरूद्वारा कार, मोटरसाइकल तथा स्कुटरको व्यावहारिक तालिम। सरकारी यातायात कार्यालय (DoTM) को ट्रायल फिल्ड मापदण्ड र ३००+ वस्तुगत प्रश्नहरूको पूर्ण तयारी।"
                    : "Looking for comprehensive car, motorbike, or scooter training in Waling, Syangja? Katarbari Driving Center provides certified instruction, authentic DoTM trial test practice grounds, and bilingual license written test preparation."}
                </motion.p>

                {/* Action Buttons */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <a
                    href="#courses"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-lg transition-all duration-200 text-sm shadow-xs hover:shadow-md font-ne gap-2 group cursor-pointer"
                  >
                    <span>{t('hero.ctaClasses')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>

                  <a
                    href="#practice-test"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 border border-slate-300 hover:border-slate-400 font-bold rounded-lg transition-all duration-200 text-sm font-ne cursor-pointer"
                  >
                    <span>{t('hero.ctaPractice')}</span>
                  </a>
                </motion.div>

                {/* Trust Metrics Bar */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="pt-6 border-t border-slate-200/90 grid grid-cols-3 gap-4"
                >
                  <div className="group">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-ne transition-transform duration-200 group-hover:translate-y-[-1px]">
                      {isNepali ? "१,८००+" : "1,800+"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium font-ne mt-0.5">
                      {isNepali ? "प्रमाणित चालकहरू" : "Certified Drivers"}
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-ne transition-transform duration-200 group-hover:translate-y-[-1px]">
                      {isNepali ? "९६%" : "96%"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium font-ne mt-0.5">
                      {isNepali ? "पहिलो पटकको सफलता" : "First-Try Pass Rate"}
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-ne transition-transform duration-200 group-hover:translate-y-[-1px]">
                      {isNepali ? "१०+ वर्ष" : "10+ Years"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium font-ne mt-0.5">
                      {isNepali ? "स्याङ्जामा सेवा" : "Serving Syangja"}
                    </div>
                  </div>
                </motion.div>

              </motion.div>

              {/* Right Column: Real Automotive Training Photograph with TiltCard and Scroll Parallax */}
              <motion.div 
                style={{ y: heroImageY, scale: heroImageScale }}
                className="lg:col-span-5 will-change-transform"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard maxTilt={3.5} scaleOnHover={1.02}>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md hover:shadow-xl transition-shadow duration-500 group">
                    <img
                      src={ASSET_IMAGES.hero}
                      alt="Driving instructor coaching a student driver on Waling training track"
                      className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                      loading="eager"
                    />
                    {/* Subtle Caption Plate */}
                    <div className="p-4 bg-white/95 backdrop-blur-xs border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 font-ne">
                        {isNepali ? "वालिङ-११ ट्रायल फिल्डमा प्रत्यक्ष सिकाइ" : "Practical training at Waling-11 grounds"}
                      </span>
                      <span className="font-bold text-red-600 font-ne">
                        {isNepali ? "DoTM ढाँचा" : "DoTM Replica"}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 4. ABOUT US / WHY CHOOSE US (FEATURING OWNER KHEM KANTA TIWARI) */}
        <section id="about" className="py-20 sm:py-28 bg-white scroll-mt-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 font-ne">
                {isNepali ? "हाम्रो परिचय र विशेषताहरू" : "About Katarbari Driving Center"}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-ne">
                {t('whyUs.title')}
              </h2>
              <p className="mt-3 text-slate-600 font-ne text-base">
                {t('whyUs.subtitle')}
              </p>
            </ScrollReveal>

            {/* Owner & Leadership Credibility Profile with Subtle 3D Depth */}
            <ScrollReveal delay={0.1}>
              <TiltCard maxTilt={1.8} scaleOnHover={1.01}>
                <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-xs">
                      KT
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 font-ne">
                          {isNepali ? "खेम कान्त तिवारी" : "Khem Kanta Tiwari"}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-ne">
                          {isNepali ? "सञ्चालक / निर्देशक" : "Owner & Director"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-ne mt-1 max-w-2xl">
                        {isNepali
                          ? "सञ्चालक खेम कान्त तिवारीको नेतृत्वमा कटरबारी ड्राइभिङ सेन्टरले वालिङ-११, स्याङ्जामा प्रयोगात्मक तथा सुरक्षित सवारी चालक तालिम प्रदान गर्दछ। सिद्धार्थ राजमार्ग र पहाडी सडकमा सुरक्षित यात्राका लागि गुणस्तरीय प्रशिक्षण हाम्रो प्रतिबद्धता हो।"
                          : "Under the leadership of owner Khem Kanta Tiwari, Katarbari Driving Center provides structured, safety-first driver training in Waling-11, Syangja. We combine comprehensive trial-track practice with practical hill and highway driving techniques."}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 active:scale-95 border border-slate-300 hover:border-slate-400 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>Call {PHONE_NUMBER}</span>
                    </a>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* 4 Core Pillars with TiltCards and Staggered Scroll Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: t('whyUs.feature1Title'),
                  desc: t('whyUs.feature1Desc'),
                  icon: <Award className="w-5 h-5 text-red-600" />,
                  tag: isNepali ? "दक्ष प्रशिक्षक" : "Certified"
                },
                {
                  title: t('whyUs.feature2Title'),
                  desc: t('whyUs.feature2Desc'),
                  icon: <Shield className="w-5 h-5 text-red-600" />,
                  tag: isNepali ? "८-आकार र र्‍याम्प" : "DoTM Specs"
                },
                {
                  title: t('whyUs.feature3Title'),
                  desc: t('whyUs.feature3Desc'),
                  icon: <Clock className="w-5 h-5 text-red-600" />,
                  tag: isNepali ? "लचिलो समय" : "Flexible Shifts"
                },
                {
                  title: t('whyUs.feature4Title'),
                  desc: t('whyUs.feature4Desc'),
                  icon: <FileText className="w-5 h-5 text-red-600" />,
                  tag: isNepali ? "३००+ प्रश्नहरू" : "Written + Eye"
                }
              ].map((item, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.08} yOffset={20}>
                  <TiltCard maxTilt={3} scaleOnHover={1.02} className="h-full">
                    <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-red-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-ne">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2 font-ne group-hover:text-red-600 transition-colors duration-200">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-ne">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>

            {/* Local Context Callout with Scroll Parallax */}
            <div className="mt-12">
              <ScrollParallax offsetY={[-10, 10]} scale={[1.015, 1.0]}>
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="space-y-1 text-center md:text-left">
                    <h4 className="text-lg font-bold font-ne">
                      {isNepali ? "वालिङ, स्याङ्जा र सिद्धार्थ राजमार्गको भौगोलिक अवस्था अनुसारको तालिम" : "Trained for Syangja's Roads and Siddhartha Highway Driving"}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-ne max-w-2xl">
                      {isNepali 
                        ? "पहाडी घुम्ती, उकालो-ओरालो, ब्रेक र क्लच नियन्त्रणको विशेष व्यावहारिक अभ्यास गराइन्छ।" 
                        : "Learn defensive steering, clutch-biting on steep hills, and confident cornering tailored to Nepal's hill highway conditions."}
                    </p>
                  </div>
                  <a
                    href="#courses"
                    className="shrink-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-lg text-xs transition-all duration-200 shadow-xs hover:shadow-md font-ne cursor-pointer"
                  >
                    {t('hero.ctaClasses')}
                  </a>
                </div>
              </ScrollParallax>
            </div>

          </div>
        </section>

        {/* 5. COURSES SECTION (EXACT FEES: SCOOTER Rs. 6,000 | MOTORBIKE Rs. 8,000 | CAR Rs. 12,000) */}
        <CoursesSection onSelectCourseForRegistration={setSelectedCourseCategory} />

        {/* 6. TRIAL FIELD GUIDE (STANDARD DOTM REPLICA) */}
        <TrialFieldGuide />

        {/* 7. WRITTEN EXAM PRACTICE (300+ DOTM QUESTIONS) */}
        <QuizEngine />

        {/* 8. EYE TEST PRACTICE (52 ISHIHARA COLOR DOT PLATES SIMULATION) */}
        <EyeTestSection />

        {/* 9. FAQ SECTION WITH SMOOTH ACCORDION TRANSITIONS */}
        <section id="faq" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            
            <ScrollReveal className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 font-ne">
                {isNepali ? "प्रायः सोधिने प्रश्नहरू" : "Frequently Asked Questions"}
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-ne">
                {t('faq.title')}
              </h2>
              <p className="mt-2 text-slate-600 font-ne text-sm">
                {t('faq.subtitle')}
              </p>
            </ScrollReveal>

            <div className="space-y-3">
              {[
                { q: t('faq.q1'), a: t('faq.a1') },
                { q: t('faq.q2'), a: t('faq.a2') },
                { q: t('faq.q3'), a: t('faq.a3') }
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-slate-900 text-base font-ne">
                        {item.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ease-out shrink-0 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="faq-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-sm text-slate-600 font-ne leading-relaxed border-t border-slate-100">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 10. REGISTRATION & INQUIRY FORM */}
        <RegistrationAndInquiry selectedCategory={selectedCourseCategory} />

      </main>

      {/* 11. STRUCTURED 4-COLUMN FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            
            {/* Col 1: Brand & Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-white text-slate-900 font-black flex items-center justify-center text-base">
                  K
                </div>
                <div>
                  <span className="font-bold text-white text-base tracking-tight block">Katarbari Driving Center</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Waling-11, Syangja, Nepal</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-ne">
                {isNepali 
                  ? "वालिङ-११, स्याङ्जामा भरपर्दो र गुणस्तरीय सवारी चालक तालिम प्रदान गर्दै आएको अग्रणी संस्था।"
                  : "Premier driver training institute in Waling-11, Syangja offering scooter, motorbike, and car driving lessons with comprehensive DoTM license test preparation."}
              </p>
              <div className="text-xs text-slate-400 font-ne">
                <span className="text-slate-300 font-semibold">{isNepali ? "सञ्चालक:" : "Proprietor:"}</span> Khem Kanta Tiwari
              </div>
            </div>

            {/* Col 2: Courses & Exact Fees */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                {isNepali ? "कोर्स तथा शुल्क" : "Training Courses & Fees"}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-ne">
                <li className="flex justify-between items-center pr-4">
                  <a href="#courses" className="hover:text-white transition">
                    {isNepali ? "स्कुटर तालिम (Category K)" : "Scooter Course (Cat K)"}
                  </a>
                  <span className="text-slate-300 font-bold">Rs. 6,000</span>
                </li>
                <li className="flex justify-between items-center pr-4">
                  <a href="#courses" className="hover:text-white transition">
                    {isNepali ? "मोटरसाइकल तालिम (Category A)" : "Motorbike Course (Cat A)"}
                  </a>
                  <span className="text-slate-300 font-bold">Rs. 8,000</span>
                </li>
                <li className="flex justify-between items-center pr-4">
                  <a href="#courses" className="hover:text-white transition">
                    {isNepali ? "कार ड्राइभिङ तालिम (Category B)" : "Car Driving Course (Cat B)"}
                  </a>
                  <span className="text-slate-300 font-bold">Rs. 12,000</span>
                </li>
                <li className="pt-1">
                  <a href="#courses" className="text-red-400 hover:text-red-300 transition">
                    {isNepali ? "सम्पूर्ण प्याकेज हेर्नुहोस् →" : "View All Packages →"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: License Prep Resources */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                {isNepali ? "अभ्यास तथा तयारी" : "License Exam Preparation"}
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-ne">
                <li>
                  <a href="#trial-field" className="hover:text-white transition">
                    {isNepali ? "DoTM ट्रायल फिल्ड गाइड (८-आकार र र्‍याम्प)" : "DoTM Trial Field Guide"}
                  </a>
                </li>
                <li>
                  <a href="#practice-test" className="hover:text-white transition">
                    {isNepali ? "३००+ वस्तुगत लिखित परीक्षा अभ्यास" : "300+ Written Exam Practice"}
                  </a>
                </li>
                <li>
                  <a href="#eye-test" className="hover:text-white transition">
                    {isNepali ? "५२-प्लेट रङ्गीन आँखा परीक्षण अभ्यास" : "52-Plate Ishihara Eye Test"}
                  </a>
                </li>
                <li>
                  <a href="#register" className="hover:text-white transition">
                    {isNepali ? "अनलाइन भर्ना फारम" : "Online Admission Form"}
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('admin');
                      window.location.hash = '#admin';
                    }}
                    className="text-slate-500 hover:text-slate-300 transition flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Staff Portal Access</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Location & Contact */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                {isNepali ? "सम्पर्क तथा ठेगाना" : "Contact & Location"}
              </h4>
              <div className="space-y-2 text-xs text-slate-400 font-ne">
                <p className="text-slate-300">
                  {isNepali ? "वालिङ नगरपालिका, वडा नं. ११, स्याङ्जा, नेपाल" : "Waling-11, Syangja, Gandaki Province, Nepal"}
                </p>
                <p>
                  <a href={`tel:${PHONE_NUMBER}`} className="hover:text-white transition">
                    Phone: {PHONE_NUMBER}
                  </a>
                </p>
                <p>
                  <a 
                    href={`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent("Hello Katarbari Driving Center, I would like to know more about your driving courses.")}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    WhatsApp: {WHATSAPP_NUMBER}
                  </a>
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p className="max-w-2xl font-ne text-center md:text-left">
              {t('footer.disclaimer')}
            </p>
            <p className="shrink-0 font-ne">
              © {new Date().getFullYear()} Katarbari Driving Center. {isNepali ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />

    </div>
  );
}
