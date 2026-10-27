import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Flag, CheckCircle, Info } from 'lucide-react';
import { ScrollReveal, TiltCard } from './motion/AppleMotion';

export default function TrialFieldGuide() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: t('trialField.step1'),
      desc: t('trialField.step1Desc'),
      score: "20 / 20 Points",
      rules: ["Never touch the white border line", "One foot down = -5 pts (passable in 70-pt system)", "Maintain consistent 1st gear throttle"],
      icon: "♾️"
    },
    {
      id: 1,
      title: t('trialField.step4'),
      desc: t('trialField.step4Desc'),
      score: "15 / 15 Points",
      rules: ["Stop completely before solid white line", "Wait for green light signal", "Check mirrors & pedestrian crossing"],
      icon: "🚦"
    },
    {
      id: 2,
      title: t('trialField.step2'),
      desc: t('trialField.step2Desc'),
      score: "20 / 20 Points",
      rules: ["Stop front tires inside yellow painted box", "Hold with handbrake & footbrake", "Clutch bite point: 0 inch rollback strictly"],
      icon: "⛰️"
    },
    {
      id: 3,
      title: t('trialField.step3'),
      desc: t('trialField.step3Desc'),
      score: "20 / 20 Points",
      rules: ["Reverse into L/T slot using side mirrors", "Do not touch boundary poles or kerbs", "Single continuous motion"],
      icon: "🅿️"
    }
  ];

  return (
    <section id="trial-field" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('trialField.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('trialField.title')}
          </h2>
          <p className="mt-3 text-slate-600 font-ne">
            {t('trialField.subtitle')}
          </p>
        </ScrollReveal>

        {/* Step Tabs with Apple-style animated sliding pill */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <motion.button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? 'border-red-600 shadow-md ring-2 ring-red-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="trial-active-pill"
                    className="absolute inset-0 bg-red-50/90 z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="relative z-10 w-full flex items-center justify-between mb-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    Part {idx + 1}
                  </span>
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-slate-900 text-sm font-ne">{step.title}</h4>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Step Detailed Card with Cinematic TiltCard */}
        <TiltCard maxTilt={1.5} scaleOnHover={1.01} className="w-full">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative border border-slate-800">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{steps[activeStep].icon}</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  Exam Weight: {steps[activeStep].score}
                </span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 font-ne">
                {steps[activeStep].title}
              </h3>
              
              <p className="text-slate-300 font-ne text-base mb-6 leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="space-y-2.5">
                <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Essential Passing Tips (कटरबारी टिप्स):
                </h5>
                {steps[activeStep].rules.map((rule, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Track Replica SVG */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col items-center justify-center">
              {activeStep === 0 && (
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 200 120" className="w-64 h-40">
                    {/* Figure 8 curves */}
                    <circle cx="65" cy="60" r="42" fill="none" stroke="#475569" strokeWidth="22" />
                    <circle cx="135" cy="60" r="42" fill="none" stroke="#475569" strokeWidth="22" />
                    <circle cx="65" cy="60" r="42" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="135" cy="60" r="42" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Direction arrows */}
                    <path d="M65 18 L60 22 L65 26" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M135 102 L140 98 L135 94" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
                    {/* Vehicle */}
                    <circle cx="65" cy="18" r="5" fill="#EF4444" />
                  </svg>
                  <span className="text-xs text-slate-400 mt-2 font-ne">
                    चित्र '८' आकार: बाहिरी रेखा नछोइकन सन्तुलन कायम गर्नुहोस्
                  </span>
                </div>
              )}

              {activeStep === 1 && (
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 200 120" className="w-64 h-40">
                    <rect x="20" y="20" width="160" height="80" rx="10" fill="#334155" />
                    {/* Zebra crossing stripes */}
                    <rect x="70" y="25" width="8" height="70" fill="#FFFFFF" />
                    <rect x="85" y="25" width="8" height="70" fill="#FFFFFF" />
                    <rect x="100" y="25" width="8" height="70" fill="#FFFFFF" />
                    <rect x="115" y="25" width="8" height="70" fill="#FFFFFF" />
                    {/* Traffic Light */}
                    <rect x="145" y="35" width="16" height="45" rx="4" fill="#0F172A" stroke="#64748B" />
                    <circle cx="153" cy="43" r="4" fill="#EF4444" opacity="0.3" />
                    <circle cx="153" cy="57" r="4" fill="#EAB308" opacity="0.3" />
                    <circle cx="153" cy="71" r="4" fill="#10B981" />
                    {/* Stop Line */}
                    <line x1="55" y1="25" x2="55" y2="95" stroke="#FACC15" strokeWidth="4" />
                  </svg>
                  <span className="text-xs text-slate-400 mt-2 font-ne">
                    पहेंलो स्टप लाइनभन्दा अगाडि रोकिनुहोस् र हरियो बत्ती कुरेर हिँड्नुहोस्
                  </span>
                </div>
              )}

              {activeStep === 2 && (
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 200 120" className="w-64 h-40">
                    {/* Incline ramp */}
                    <polygon points="20,100 180,30 180,100" fill="#475569" />
                    {/* Stop box */}
                    <rect x="90" y="55" width="35" height="15" fill="#EAB308" transform="rotate(-23 90 55)" opacity="0.8" />
                    {/* Car silhouette */}
                    <rect x="100" y="45" width="22" height="10" rx="2" fill="#38BDF8" transform="rotate(-23 100 45)" />
                  </svg>
                  <span className="text-xs text-slate-400 mt-2 font-ne">
                    र्याम्पको पहेंलो कोठाभित्र रोकिएर पछाडि नसरिकनै क्लच मिलाएर अघि बढ्नुहोस्
                  </span>
                </div>
              )}

              {activeStep === 3 && (
                <div className="w-full flex flex-col items-center">
                  <svg viewBox="0 0 200 120" className="w-64 h-40">
                    <rect x="30" y="20" width="140" height="80" rx="6" fill="#334155" />
                    {/* Parking box bay */}
                    <rect x="80" y="30" width="40" height="60" fill="none" stroke="#FACC15" strokeWidth="3" strokeDasharray="3 3" />
                    {/* Car reverse track */}
                    <path d="M50 90 Q 70 90 100 65" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                    <rect x="90" y="40" width="20" height="35" rx="3" fill="#10B981" />
                  </svg>
                  <span className="text-xs text-slate-400 mt-2 font-ne">
                    दुवै साइडका पोल वा रेखा नछोई ग्यारेजमा गाडी छिराउनुहोस्
                  </span>
                </div>
              )}
            </div>

            </motion.div>
          </AnimatePresence>
          </div>
        </TiltCard>

      </div>
    </section>
  );
}
