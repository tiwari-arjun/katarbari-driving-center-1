import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES_DATA, CourseItem } from '../data/coursesData';
import { ASSET_IMAGES } from '../assets/assetImages';
import { 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  ClipboardList, 
  X, 
  Clock,
  ShieldCheck, 
  Tag,
  PhoneCall
} from 'lucide-react';

interface CoursesSectionProps {
  onSelectCourseForRegistration?: (categoryValue: string) => void;
  refreshTrigger?: number;
}

export default function CoursesSection({ onSelectCourseForRegistration, refreshTrigger }: CoursesSectionProps) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'ne';
  const isNepali = currentLang === 'ne';

  // Live courses synchronized with backend
  const [liveCourses, setLiveCourses] = useState<CourseItem[]>(COURSES_DATA);

  // Re-fetch courses when component mounts or refreshTrigger increments
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.courses && Array.isArray(data.courses)) {
          setLiveCourses(prev => prev.map(c => {
            const remote = data.courses.find((rc: any) => rc.id === c.id);
            if (remote) {
              return {
                ...c,
                price: remote.price || c.price,
                description: {
                  en: remote.descriptionEn || c.description.en,
                  ne: remote.descriptionNe || c.description.ne
                },
                active: remote.active !== undefined ? remote.active : c.active
              };
            }
            return c;
          }));
        }
      })
      .catch(() => {});
  }, [refreshTrigger]);

  // State for active course modal
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Waling-11, Syangja WhatsApp Phone Number
  const WHATSAPP_PHONE = "9779856011009";

  const handleEnrollClick = (course: CourseItem) => {
    setSelectedCourse(course);
  };

  const handleFormEnroll = () => {
    if (selectedCourse && onSelectCourseForRegistration) {
      onSelectCourseForRegistration(selectedCourse.formCategoryValue);
    }
    setSelectedCourse(null);
    const registerElem = document.getElementById('register');
    if (registerElem) {
      registerElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getWhatsAppUrl = (course: CourseItem) => {
    const rawMsg = course.whatsAppText[isNepali ? 'ne' : 'en'];
    const encoded = encodeURIComponent(rawMsg);
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  };

  const getCourseImage = (vehicleType: string) => {
    switch (vehicleType) {
      case 'car':
        return ASSET_IMAGES.courseCar;
      case 'motorbike':
        return ASSET_IMAGES.courseMotorbike;
      case 'scooter':
      default:
        return ASSET_IMAGES.courseScooter;
    }
  };

  return (
    <section id="courses" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. SECTION HEADER - Clean Editorial */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 font-ne">
            {isNepali ? "वालिङ, स्याङ्जा ड्राइभिङ प्रशिक्षण" : "Training Programs • Waling, Syangja"}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight font-ne">
            {t('courses.title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-ne leading-relaxed">
            {t('courses.description')}
          </p>
        </div>

        {/* 2. THREE COURSE CARDS GRID - Editorial Automotive Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {liveCourses.map((course) => {
            const courseName = course.name[isNepali ? 'ne' : 'en'];
            const courseBadge = course.badge[isNepali ? 'ne' : 'en'];
            const courseDesc = course.description[isNepali ? 'ne' : 'en'];
            const courseFeatures = course.features[isNepali ? 'ne' : 'en'];
            const courseDuration = course.duration[isNepali ? 'ne' : 'en'];
            const isCar = course.vehicleType === 'car';
            const courseImg = getCourseImage(course.vehicleType);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img 
                      src={courseImg} 
                      alt={courseName}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded font-ne">
                      {courseBadge}
                    </div>
                    {isCar && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded font-ne">
                        {isNepali ? "लोकप्रिय प्याकेज" : "Most Popular"}
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2 font-ne">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{courseDuration}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2.5 font-ne">
                      {courseName}
                    </h3>

                    <p className="text-sm text-slate-600 font-ne leading-relaxed mb-6">
                      {courseDesc}
                    </p>

                    {/* Exact Price Display */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-slate-500 font-ne">
                        {isNepali ? "कोर्स शुल्क (Exact Fee):" : "Official Course Fee:"}
                      </span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight font-ne">
                        {isNepali ? course.priceNe : course.priceEn}
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-ne">
                        {t('courses.featuresHeader')}
                      </div>
                      {courseFeatures.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-ne">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-2 border-t border-slate-100 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleEnrollClick(course)}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer font-ne"
                    >
                      <span>{t('courses.enrollBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={getWhatsAppUrl(course)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 font-ne cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust banner underneath courses */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm font-ne">
                {isNepali ? "सरकारी यातायात कार्यालय (DoTM) मापदण्ड अनुसारको तालिम" : "Government DoTM Compliant Driving Instruction"}
              </p>
              <p className="text-xs text-slate-500 font-ne">
                {isNepali ? "वालिङ नगरपालिका-११, स्याङ्जा स्थित आफ्नै विस्तृत ट्रायल फिल्डमा पूर्ण अभ्यास गराइन्छ।" : "Full practical instruction conducted on our dedicated trial field in Waling-11, Syangja."}
              </p>
            </div>
          </div>
          <a
            href="tel:9856011009"
            className="shrink-0 inline-flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-lg transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            <span>Call 9856011009</span>
          </a>
        </div>

      </div>

      {/* 3. ENROLLMENT MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider font-ne">
                    {selectedCourse.badge[isNepali ? 'ne' : 'en']}
                  </span>
                  <h3 className="text-lg font-bold font-ne mt-0.5">
                    {selectedCourse.name[isNepali ? 'ne' : 'en']}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-slate-500 uppercase font-bold font-ne">
                    {isNepali ? "कोर्स शुल्क:" : "Official Course Fee:"}
                  </span>
                  <div className="text-xl font-black text-slate-900 font-ne">
                    {isNepali ? selectedCourse.priceNe : selectedCourse.priceEn}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-ne">
                  {t('courses.selectMethod')}
                </p>

                {/* Option 1: WhatsApp */}
                <a
                  href={getWhatsAppUrl(selectedCourse)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedCourse(null)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 transition flex items-center justify-between group cursor-pointer block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 text-sm font-ne">
                        {t('courses.whatsAppOptionTitle')}
                      </div>
                      <div className="text-[11px] text-slate-500 font-ne">
                        {t('courses.whatsAppOptionDesc')}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                </a>

                {/* Option 2: Online Registration Form */}
                <button
                  type="button"
                  onClick={handleFormEnroll}
                  className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 text-sm font-ne">
                        {t('courses.formOptionTitle')}
                      </div>
                      <div className="text-[11px] text-slate-500 font-ne">
                        {t('courses.formOptionDesc')}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition" />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {t('courses.close')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
