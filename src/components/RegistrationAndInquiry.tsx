import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Phone, Clock, MapPin, CheckCircle, ExternalLink, Calendar, Send } from 'lucide-react';
import { ScrollReveal } from './motion/AppleMotion';

interface RegistrationAndInquiryProps {
  selectedCategory?: string;
}

export default function RegistrationAndInquiry({ selectedCategory }: RegistrationAndInquiryProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];
  const isNepali = currentLang === 'ne';

  // Specific Google Forms URLs for each language
  const GOOGLE_FORMS_CONFIG: Record<string, string> = {
    en: "https://docs.google.com/forms/d/e/1FAIpQLSc-EXAMPLE-EN/viewform?embedded=true",
    ne: "https://docs.google.com/forms/d/e/1FAIpQLSc-EXAMPLE-NE/viewform?embedded=true"
  };

  const activeFormUrl = GOOGLE_FORMS_CONFIG[currentLang] || GOOGLE_FORMS_CONFIG.en;

  // Verified contact details for Katarbari Driving Center in Waling-11, Syangja
  const CONTACT_PHONE = "9856011009";
  const WHATSAPP_PHONE = "9779856011009";

  // State for direct local booking form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    category: selectedCategory || 'Category B (Car / Jeep)',
    shift: 'Morning (6:00 AM - 10:00 AM)',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedCategory) {
      setFormData(prev => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrationId(data.registrationId || data.student?.id || 'KDC-SUBMITTED');
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit registration');
      }
    } catch (err) {
      setErrorMessage('Could not connect to registration server. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Scroll Reveal */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-brand-700 bg-brand-50 border border-brand-200 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {t('registration.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {t('registration.title')}
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto font-ne">
            {t('registration.subtitle')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Information & Hours */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-xs hover:shadow-md transition-shadow duration-300"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                {t('nav.contact')}
              </h3>
              <p className="text-sm text-slate-600 font-ne leading-relaxed">
                {isNepali ? "वालिङ नगरपालिका-११, स्याङ्जा, गण्डकी प्रदेश, नेपाल" : "Waling-11, Syangja, Gandaki Province, Nepal"}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                {t('registration.phoneInquiry')}
              </h4>
              <a 
                href={`tel:${CONTACT_PHONE}`}
                className="text-slate-900 hover:text-red-600 font-extrabold text-xl tracking-tight transition-colors block"
              >
                {CONTACT_PHONE}
              </a>
              <span className="text-xs text-slate-500 font-ne mt-0.5 block">
                {isNepali ? "सिधा फोन वा ह्वाट्सएप (WhatsApp) मा सम्पर्क गर्नुहोस्" : "Direct phone call or WhatsApp inquiry"}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                {isNepali ? "तालिम समय (Shifts)" : "Training Shifts & Hours"}
              </h4>
              <p className="text-xs text-slate-600 font-ne leading-relaxed">
                {isNepali 
                  ? "बिहान: ६:०० - १०:०० | दिउँसो: ११:०० - ३:०० | साँझ: ३:०० - ६:००" 
                  : "Morning: 6:00 AM - 10:00 AM | Day: 11:00 AM - 3:00 PM | Evening: 3:00 PM - 6:00 PM"}
              </p>
              <span className="text-xs text-slate-500 font-ne mt-1 block">
                {isNepali ? "हप्ताको ७ दिन नै खुला (आइतबार - शनिबार)" : "Open 7 days a week (Sun - Sat)"}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(isNepali ? "नमस्कार, मलाई Katarbari Driving Center को ड्राइभिङ कोर्सबारे थप जानकारी चाहिएको छ।" : "Hello Katarbari Driving Center, I would like to know more about your driving courses.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-sm font-ne"
              >
                <span>{isNepali ? "ह्वाट्सएपमा सोधपुछ गर्नुहोस्" : "Chat on WhatsApp"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Interactive Fast Enrollment Form + Google Form option */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow duration-300"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t('registration.instantEnroll')}</h3>
                <p className="text-xs text-slate-500 font-ne mt-0.5">{t('registration.formNotice')}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 font-ne">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Seats Open for Syangja Batches
              </span>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center my-6"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-emerald-950 mb-1">Enrollment Request Received!</h4>
                {registrationId && (
                  <div className="inline-block px-3 py-1 bg-white border border-emerald-300 rounded-full text-xs font-mono font-bold text-emerald-800 mb-3">
                    Ref ID: {registrationId}
                  </div>
                )}
                <p className="text-emerald-800 text-sm font-ne max-w-md mx-auto mb-6">
                  {t('registration.bookingSuccess')}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition active:scale-95 cursor-pointer"
                >
                  Register Another Student
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold font-ne">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-ne">
                      {t('registration.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Thapa"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-sm transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-ne">
                      {t('registration.phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-ne">
                      {t('registration.preferredCategory')}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-sm cursor-pointer transition-all duration-200 font-ne"
                    >
                      <option value="Category B (Car / Jeep)">Category B: Car / Jeep (४ पाङ्ग्रे)</option>
                      <option value="Category A (Motorcycle)">Category A: Motorcycle (२ पाङ्ग्रे)</option>
                      <option value="Category K (Scooter)">Category K: Scooter (स्कुटर)</option>
                      <option value="Combo (Car + Bike)">Combo: Car + Bike (दुवै तालिम)</option>
                      <option value="Trial Refresher Course">Trial Special Preparation / Refresher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-ne">
                      {t('registration.preferredTime')}
                    </label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-sm cursor-pointer transition-all duration-200 font-ne"
                    >
                      <option value="Morning (6:00 AM - 10:00 AM)">{t('registration.morning')}</option>
                      <option value="Day (11:00 AM - 3:00 PM)">{t('registration.day')}</option>
                      <option value="Evening (3:00 PM - 6:00 PM)">{t('registration.evening')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-ne">
                    {t('registration.notes')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us if you have tried trial before, have any specific schedule preferences, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white text-sm transition-all duration-200"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-base disabled:opacity-70 font-ne"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? (isNepali ? "पठाउँदै..." : "Submitting...") : t('registration.submitBooking')}</span>
                </button>
              </form>
            )}

            {/* Embedded Google Form Option Accordion */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <details className="group">
                <summary className="text-xs font-bold text-slate-600 uppercase tracking-wider cursor-pointer list-none flex items-center justify-between hover:text-red-600 transition-colors">
                  <span>Or use standard embedded Google Forms questionnaire</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-4 w-full h-[480px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                  <iframe
                    title="Student Registration Google Form"
                    src={activeFormUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="w-full h-full"
                  >
                    Loading form…
                  </iframe>
                </div>
              </details>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
