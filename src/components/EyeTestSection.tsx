import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ISHIHARA_PLATES, 
  ISHIHARA_DISCLAIMER, 
  IshiharaPlate 
} from '../data/ishiharaPlatesData';
import IshiharaPlateSvg from './IshiharaPlateSvg';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Clock, 
  Award, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ScrollReveal } from './motion/AppleMotion';

type TestMode = 'practice' | 'timed' | 'full';

interface ShuffledQuestion {
  plate: IshiharaPlate;
  options: string[];
}

export default function EyeTestSection() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'ne';
  const isNepali = currentLang === 'ne';

  // Mode & configuration
  const [testMode, setTestMode] = useState<TestMode>('practice');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [plateZoom, setPlateZoom] = useState<'normal' | 'large' | 'xl'>('normal');
  const [isModalZoom, setIsModalZoom] = useState<boolean>(false);

  // Active quiz state
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedPlates, setSubmittedPlates] = useState<Record<string, boolean>>({});
  const [showSolutionOutline, setShowSolutionOutline] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all');

  // Timed challenge state
  const TIME_PER_QUESTION = 15; // 15 seconds per plate
  const [timeLeft, setTimeLeft] = useState<number>(TIME_PER_QUESTION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter and prepare question pool
  const questionPool = useMemo(() => {
    let list = [...ISHIHARA_PLATES];
    if (selectedDifficulty !== 'all') {
      list = list.filter(p => p.difficulty === selectedDifficulty);
    }
    // For Full Practice Test: curate 15 diverse plates
    if (testMode === 'full') {
      return list.slice(0, 15);
    }
    // For Timed Challenge: 10 plates
    if (testMode === 'timed') {
      return list.slice(0, 10);
    }
    return list;
  }, [selectedDifficulty, testMode]);

  // Prepared questions with shuffled distractors
  const questions: ShuffledQuestion[] = useMemo(() => {
    return questionPool.map((plate) => {
      // Deterministically combine correct number with 3 distractors
      const rawOptions = [plate.number, ...plate.distractors];
      
      // Seeded shuffle based on plate.seed so answer position is stable
      const shuffled = [...rawOptions].sort((a, b) => {
        const hashA = (a.charCodeAt(0) * 17 + plate.seed) % 19;
        const hashB = (b.charCodeAt(0) * 17 + plate.seed) % 19;
        return hashA - hashB;
      });

      return {
        plate,
        options: shuffled
      };
    });
  }, [questionPool]);

  const currentQ = questions[currentIndex] || questions[0];

  // Reset timer on question change in timed mode
  useEffect(() => {
    if (testMode === 'timed' && hasStarted && !isFinished) {
      setTimeLeft(TIME_PER_QUESTION);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, hasStarted, isFinished, testMode]);

  // Handle auto-advance when timer expires in timed mode
  const handleTimeExpiry = () => {
    if (!currentQ) return;
    const plateId = currentQ.plate.id;
    if (!userAnswers[plateId]) {
      setUserAnswers(prev => ({ ...prev, [plateId]: 'SKIPPED_TIME_EXPIRED' }));
    }
    setSubmittedPlates(prev => ({ ...prev, [plateId]: true }));

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishTest();
      }
    }, 800);
  };

  const handleSelectOption = (opt: string) => {
    if (!currentQ) return;
    const plateId = currentQ.plate.id;
    if (submittedPlates[plateId]) return;

    setUserAnswers(prev => ({ ...prev, [plateId]: opt }));
    setSubmittedPlates(prev => ({ ...prev, [plateId]: true }));

    // In timed mode, auto advance after short feedback delay
    if (testMode === 'timed') {
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          finishTest();
        }
      }, 1200);
    }
  };

  const handleNext = () => {
    setShowSolutionOutline(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    setShowSolutionOutline(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const finishTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    setShowSolutionOutline(false);

    // Compute final score
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.plate.id] === q.plate.number) {
        correctCount++;
      }
    });

    const total = questions.length;
    const passed = (correctCount / total) >= 0.75;

    // Log analytics to backend
    try {
      await fetch('/api/analytics/test-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'eye_test',
          score: correctCount,
          total,
          passed
        })
      });
    } catch (err) {
      // safe fallback
    }
  };

  const handleRestart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setUserAnswers({});
    setSubmittedPlates({});
    setCurrentIndex(0);
    setIsFinished(false);
    setHasStarted(false);
    setShowSolutionOutline(false);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const handleStart = () => {
    setUserAnswers({});
    setSubmittedPlates({});
    setCurrentIndex(0);
    setIsFinished(false);
    setShowSolutionOutline(false);
    setTimeLeft(TIME_PER_QUESTION);
    setHasStarted(true);
  };

  // Score statistics
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    const wrongList: ShuffledQuestion[] = [];

    questions.forEach(q => {
      const selected = userAnswers[q.plate.id];
      if (selected === q.plate.number) {
        correct++;
      } else {
        wrong++;
        wrongList.push(q);
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const isPassing = percentage >= 75;

    return { total, correct, wrong, percentage, isPassing, wrongList };
  }, [questions, userAnswers]);

  // Plate display size classes
  const getPlateSize = () => {
    switch (plateZoom) {
      case 'xl':
        return 440;
      case 'large':
        return 380;
      default:
        return 320;
    }
  };

  return (
    <section id="eye-test" className="py-20 bg-slate-50 border-t border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Scroll Reveal */}
        <ScrollReveal className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider rounded-full mb-3 border border-blue-200 font-ne shadow-xs">
            <Eye className="w-4 h-4 text-blue-700" />
            <span>{isNepali ? "रङ्गीन बिन्दु पहिचान अभ्यास" : "Ishihara-Style Plate Recognition"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-ne">
            {isNepali ? "आँखा परीक्षण अभ्यास" : "Eye Test Practice"}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-ne leading-relaxed">
            {isNepali
              ? "सवारी चालक अनुमतिपत्रको स्वास्थ्य परीक्षणमा सोधिने रङ्गीन बिन्दु ढाँचा (Colour-Dot Plates) बाट लुकेको नम्बर पहिचान गर्ने अभ्यास गर्नुहोस्।"
              : "Identify hidden numbers inside authentic pseudoisochromatic colour-dot plates inspired by driving licence preliminary vision assessments."}
          </p>
        </ScrollReveal>

        {/* Clear Medical Non-Diagnostic Disclaimer Banner */}
        <ScrollReveal delay={0.08}>
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 mb-8 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="font-ne leading-relaxed">
              <strong>{isNepali ? "महत्त्वपूर्ण शैक्षिक सूचना:" : "Educational Disclaimer:"}</strong>{' '}
              {isNepali ? ISHIHARA_DISCLAIMER.ne : ISHIHARA_DISCLAIMER.en}
            </div>
          </div>
        </ScrollReveal>

        {/* ========================================================
            SCREEN 1: SETUP SCREEN & MODE SELECTION
        ======================================================== */}
        {!hasStarted && !isFinished && (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200">
            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-ne">
                {isNepali ? "अभ्यास मोड छान्नुहोस्" : "Select Practice Mode"}
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
                52 {isNepali ? "युनिक प्लेटहरू उपलब्ध" : "Unique Plates Available"}
              </span>
            </div>

            {/* 3 Interactive Test Modes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  id: 'practice' as TestMode,
                  titleEn: 'Practice Mode',
                  titleNe: 'स्वचालित अभ्यास (Practice)',
                  descEn: 'No time limit. Instant feedback and educational explanations for every plate.',
                  descNe: 'कुनै समय सीमा छैन। प्रत्येक प्लेटपछि तत्काल सही उत्तर र व्याख्या।',
                  icon: <HelpCircle className="w-6 h-6 text-brand-600" />,
                  badge: 'Self-Paced'
                },
                {
                  id: 'timed' as TestMode,
                  titleEn: 'Timed Challenge',
                  titleNe: 'समयबद्ध चुनौती (Timed)',
                  descEn: '15 seconds per plate. 10 rapid recognition plates with countdown timer.',
                  descNe: 'प्रति प्लेट १५ सेकेन्ड समय। १० वटा द्रुत पहिचान प्लेटहरू।',
                  icon: <Clock className="w-6 h-6 text-amber-600" />,
                  badge: '15s Per Plate'
                },
                {
                  id: 'full' as TestMode,
                  titleEn: 'Full Practice Test',
                  titleNe: 'पूर्ण नमूना परीक्षा (Full Test)',
                  descEn: '15 diverse plates across all 8 colour palettes with comprehensive report.',
                  descNe: 'सबै ८ रङ ढाँचाबाट १५ वटा प्लेटहरूको पूर्ण नतिजा समीक्षा।',
                  icon: <Award className="w-6 h-6 text-emerald-600" />,
                  badge: '15 Plates'
                }
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTestMode(mode.id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    testMode === mode.id
                      ? 'border-brand-600 bg-brand-50/70 shadow-md ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                        {mode.icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {mode.badge}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base mb-1 font-ne">
                      {isNepali ? mode.titleNe : mode.titleEn}
                    </div>
                    <p className="text-xs text-slate-600 font-ne leading-relaxed">
                      {isNepali ? mode.descNe : mode.descEn}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700">
                    <span>{testMode === mode.id ? (isNepali ? "छानिएको ✓" : "Selected ✓") : (isNepali ? "छान्नुहोस्" : "Select")}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            {/* Difficulty Filter (Only in Practice Mode) */}
            {testMode === 'practice' && (
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-ne">
                  {isNepali ? "कठिनाई स्तर (Difficulty Filter):" : "Difficulty Level:"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', labelEn: 'All Plates (52)', labelNe: 'सबै प्लेटहरू (५२)' },
                    { id: 'easy', labelEn: 'Easy (Clear Contrast)', labelNe: 'सजिलो (स्पष्ट कन्ट्रास्ट)' },
                    { id: 'medium', labelEn: 'Medium (Standard Test)', labelNe: 'मध्यम (मानक प्लेट)' },
                    { id: 'hard', labelEn: 'Hard (Close Tones)', labelNe: 'कठिन (नजिकका रङहरू)' }
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(d.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer font-ne ${
                        selectedDifficulty === d.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isNepali ? d.labelNe : d.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Display Size / Zoom Preference */}
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-700 font-ne">
                  {isNepali ? "प्लेटको आकार (Plate Display Size):" : "Plate Display Size:"}
                </span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'normal', label: isNepali ? 'सामान्य' : 'Normal (320px)' },
                  { id: 'large', label: isNepali ? 'ठूलो' : 'Large (380px)' },
                  { id: 'xl', label: isNepali ? 'अति ठूलो' : 'X-Large (440px)' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPlateZoom(s.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      plateZoom === s.id ? 'bg-brand-600 text-white' : 'bg-white border text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start CTA Button */}
            <button
              type="button"
              onClick={handleStart}
              disabled={questions.length === 0}
              className="w-full py-4 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition active:scale-[0.99] text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer font-ne"
            >
              <span>{isNepali ? "परीक्षण सुरु गर्नुहोस्" : "Start Eye Test Practice"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: ACTIVE QUESTION RUNNER
        ======================================================== */}
        {hasStarted && !isFinished && currentQ && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            
            {/* Top Toolbar */}
            <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full font-ne">
                  {isNepali 
                    ? `प्लेट ${currentIndex + 1} / ${questions.length}`
                    : `Plate ${currentIndex + 1} of ${questions.length}`}
                </span>
                <span className="text-xs text-slate-300 font-medium capitalize hidden sm:inline font-ne">
                  {currentQ.plate.difficulty} level
                </span>
              </div>

              {/* Progress bar in center */}
              <div className="flex-1 max-w-xs mx-auto hidden sm:block">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Timed countdown or Zoom controls */}
              <div className="flex items-center gap-3">
                {testMode === 'timed' ? (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs ${
                    timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-amber-300'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeft}s</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl">
                    <button
                      type="button"
                      title="Zoom Out"
                      onClick={() => setPlateZoom(plateZoom === 'xl' ? 'large' : 'normal')}
                      className="text-slate-300 hover:text-white p-1 cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono uppercase px-1">{plateZoom}</span>
                    <button
                      type="button"
                      title="Zoom In"
                      onClick={() => setPlateZoom(plateZoom === 'normal' ? 'large' : 'xl')}
                      className="text-slate-300 hover:text-white p-1 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Fullscreen Inspect"
                      onClick={() => setIsModalZoom(true)}
                      className="text-slate-300 hover:text-white p-1 ml-1 cursor-pointer border-l border-slate-700 pl-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Plate Inspection Area */}
            <div className="p-6 sm:p-8 flex flex-col items-center">
              
              {/* Question Header */}
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">
                  {isNepali ? "रङ्गीन बिन्दु ढाँचा" : "Colour-Dot Pattern Recognition"}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-ne">
                  {isNepali ? "तपाईंलाई कुन नम्बर देखिन्छ?" : "What number can you see?"}
                </h3>
              </div>

              {/* The Realistic Ishihara Dot Plate Graphic */}
              <div className="my-2 p-4 bg-stone-100/70 rounded-3xl border border-stone-200/90 shadow-inner flex items-center justify-center relative">
                <IshiharaPlateSvg
                  number={currentQ.plate.number}
                  paletteId={currentQ.plate.paletteId}
                  seed={currentQ.plate.seed}
                  size={getPlateSize()}
                  showSolutionOutline={showSolutionOutline}
                />

                {/* Inspect button overlay */}
                <button
                  type="button"
                  onClick={() => setIsModalZoom(true)}
                  className="absolute bottom-6 right-6 p-2 bg-white/95 hover:bg-white text-slate-700 rounded-full shadow-md border border-slate-200 transition transform hover:scale-110 cursor-pointer"
                  title={isNepali ? "ठूलो बनाएर हेर्नुहोस्" : "Enlarge Plate"}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Prompt instruction subtitle and Quick Enlarge Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 mb-6 text-center">
                <span className="text-xs text-slate-500 font-ne">
                  {isNepali 
                    ? "सफा पृष्ठभूमिमा रङ्गीन बिन्दुहरू ध्यान दिएर हेर्नुहोस्।"
                    : "Inspect the distinct colored dots against the pale plate background."}
                </span>
                <button
                  type="button"
                  onClick={() => setIsModalZoom(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs cursor-pointer font-ne"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isNepali ? "ठूलो बनाएर हेर्नुहोस्" : "Enlarge Plate"}</span>
                </button>
              </div>

              {/* Four Large Accessible Answer Options */}
              <div className="w-full max-w-xl grid grid-cols-2 gap-3.5 mb-6">
                {currentQ.options.map((opt, optIdx) => {
                  const plateId = currentQ.plate.id;
                  const isSelected = userAnswers[plateId] === opt;
                  const isChecked = !!submittedPlates[plateId];
                  const isCorrect = opt === currentQ.plate.number;

                  let optClass = "border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-900 shadow-xs";
                  
                  if (isSelected && !isChecked) {
                    optClass = "border-brand-600 bg-brand-50 ring-2 ring-brand-500/20 text-brand-950 font-bold";
                  } else if (isChecked) {
                    if (isCorrect) {
                      optClass = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optClass = "border-red-400 bg-red-50 text-red-950 ring-2 ring-red-400/20 font-bold";
                    } else {
                      optClass = "border-slate-200 bg-slate-50/50 text-slate-400 opacity-60";
                    }
                  }

                  const letterLabels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isChecked}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {letterLabels[optIdx]}
                      </span>

                      <span className="text-2xl font-black font-mono tracking-wider flex-1 text-center">
                        {opt}
                      </span>

                      <span className="w-7 h-7 flex items-center justify-center shrink-0">
                        {isChecked && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                        {isChecked && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Educational Explanations (Once Answered) */}
              {submittedPlates[currentQ.plate.id] && (
                <div className="w-full max-w-xl animate-fadeIn">
                  {userAnswers[currentQ.plate.id] === currentQ.plate.number ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl mb-4 text-emerald-900 text-sm flex items-start gap-3 shadow-xs">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold font-ne text-emerald-950 mb-0.5">
                          {isNepali ? "सही उत्तर! (Correct Answer)" : "Correct Answer!"}
                        </div>
                        <p className="text-xs text-emerald-800 font-ne leading-relaxed">
                          {isNepali ? currentQ.plate.explanation.ne : currentQ.plate.explanation.en}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-300 rounded-2xl mb-4 text-red-900 text-sm flex items-start gap-3 shadow-xs">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold font-ne text-red-950 mb-0.5">
                          {isNepali 
                            ? `गलत उत्तर। सही नम्बर ${currentQ.plate.number} हो।` 
                            : `Incorrect. The correct hidden number is ${currentQ.plate.number}.`}
                        </div>
                        <p className="text-xs text-red-800 font-ne leading-relaxed">
                          {isNepali ? currentQ.plate.explanation.ne : currentQ.plate.explanation.en}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Learning Helper: Toggle Solution Outline */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-600 font-ne">
                      {isNepali 
                        ? "नम्बर कहाँ लुकेको छ स्पष्ट हेर्नुहोस्:" 
                        : "Educational review tool:"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSolutionOutline(!showSolutionOutline)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer font-ne ${
                        showSolutionOutline 
                          ? 'bg-amber-400 text-slate-950 shadow-xs' 
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {showSolutionOutline 
                        ? (isNepali ? "आउटलाइन बन्द गर्नुहोस्" : "Hide Pattern Outline") 
                        : (isNepali ? "नम्बरको ढाँचा हाइलाइट गर्नुहोस् 💡" : "Highlight Hidden Number 💡")}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="w-full max-w-xl flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-30 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer font-ne"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isNepali ? "अघिल्लो" : "Previous"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-2.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                    title={isNepali ? "पुनः सुरु गर्नुहोस्" : "Restart"}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer font-ne"
                  >
                    <span>
                      {currentIndex === questions.length - 1
                        ? (isNepali ? "नतिजा हेर्नुहोस्" : "Finish Test")
                        : (isNepali ? "अर्को प्रश्न" : "Next Plate")}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: COMPREHENSIVE FINAL SCORE REPORT
        ======================================================== */}
        {isFinished && (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200 animate-fadeIn">
            
            {/* Celebration Header */}
            <div className="text-center mb-8 pb-8 border-b border-slate-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-4xl shadow-inner">
                {stats.isPassing ? "🎯" : "📖"}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-ne">
                {isNepali ? "तपाईंको परीक्षण नतिजा" : "Eye Test Practice Results"}
              </h3>
              
              <p className="mt-2 text-slate-600 text-sm font-ne max-w-lg mx-auto">
                {stats.isPassing
                  ? (isNepali 
                      ? "बधाई छ! तपाईंले अधिकांश रङ्गीन बिन्दु ढाँचाका नम्बरहरू सही पहिचान गर्नुभयो।"
                      : "Great job! You demonstrated strong visual recognition across the test plates.")
                  : (isNepali 
                      ? "अभ्यास जारी राख्नुहोस्। तलका गलत भएका नम्बरहरूको ढाँचा पुनः दोहोर्याएर हेर्नुहोस्।"
                      : "Keep practicing! Review the missed plates below to familiarize yourself with subtle contrasts.")}
              </p>

              {/* Big Score Callout */}
              <div className="mt-6 inline-flex flex-col items-center p-6 bg-slate-50 border border-slate-200 rounded-3xl min-w-[240px]">
                <div className="text-5xl font-black text-slate-900 font-mono tracking-tight">
                  {stats.percentage}%
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {stats.correct} / {stats.total} {isNepali ? "सही उत्तर" : "Correct Recognitions"}
                </div>
                
                <div className="mt-3">
                  {stats.isPassing ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full font-ne inline-flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isNepali ? "सफल पहिचान स्तर" : "Recognition Standard Met"}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full font-ne inline-flex items-center gap-1 border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isNepali ? "थप अभ्यास सिफारिस" : "Practice Recommended"}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Question Review & Missed Plates */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h4 className="font-bold text-slate-900 text-base font-ne">
                  {isNepali ? "प्लेट समीक्षा (Plate-by-Plate Review):" : "Detailed Plate Review:"}
                </h4>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer font-ne ${
                      reviewFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isNepali ? `सबै (${stats.total})` : `All (${stats.total})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('wrong')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer font-ne ${
                      reviewFilter === 'wrong' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isNepali ? `गलत भएका (${stats.wrong})` : `Missed (${stats.wrong})`}
                  </button>
                </div>
              </div>

              {/* Review Grid */}
              <div className="space-y-3">
                {(reviewFilter === 'wrong' ? stats.wrongList : questions).map((q, idx) => {
                  const plateId = q.plate.id;
                  const userAnswer = userAnswers[plateId];
                  const isCorrect = userAnswer === q.plate.number;

                  return (
                    <div 
                      key={plateId}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                        isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Miniature plate preview */}
                        <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden shadow-xs border border-slate-200 bg-white">
                          <IshiharaPlateSvg
                            number={q.plate.number}
                            paletteId={q.plate.paletteId}
                            seed={q.plate.seed}
                            size={56}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                            {q.plate.id.toUpperCase()} • {q.plate.difficulty}
                          </div>
                          <div className="text-sm font-bold text-slate-900 font-ne">
                            {isNepali ? q.plate.description.ne : q.plate.description.en}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-ne shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                        <div className="text-slate-600">
                          {isNepali ? "तपाईंको उत्तर:" : "Your Answer:"}{' '}
                          <span className={`font-mono font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                            {userAnswer || (isNepali ? "अनुत्तरित" : "Skipped")}
                          </span>
                        </div>

                        <div className="text-emerald-800 font-bold">
                          {isNepali ? "सही नम्बर:" : "Hidden Number:"}{' '}
                          <span className="font-mono bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-md">
                            {q.plate.number}
                          </span>
                        </div>

                        <div>
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Restart & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-2xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-ne"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isNepali ? "पुनः परीक्षण गर्नुहोस्" : "Restart Practice"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTestMode(testMode === 'practice' ? 'timed' : 'practice');
                  handleRestart();
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition cursor-pointer font-ne"
              >
                <span>
                  {testMode === 'practice' 
                    ? (isNepali ? "समयबद्ध चुनौती खेल्नुहोस् ⏱️" : "Try Timed Challenge ⏱️")
                    : (isNepali ? "स्वचालित अभ्यास मोड 📖" : "Switch to Practice Mode 📖")}
                </span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================
          FULLSCREEN / ENLARGED MODAL INSPECTION
      ======================================================== */}
      <AnimatePresence>
        {isModalZoom && currentQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsModalZoom(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-700 relative flex flex-col items-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="font-bold text-slate-900 text-sm font-ne">
                  {isNepali ? "विस्तृत प्लेट निरीक्षण (High-Resolution Zoom)" : "Enlarged Plate Inspection"}
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalZoom(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors active:scale-95"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-stone-100 rounded-3xl border border-stone-200">
                <IshiharaPlateSvg
                  number={currentQ.plate.number}
                  paletteId={currentQ.plate.paletteId}
                  seed={currentQ.plate.seed}
                  size={Math.min(480, typeof window !== 'undefined' ? window.innerWidth - 64 : 440)}
                  showSolutionOutline={showSolutionOutline}
                />
              </div>

              <p className="mt-4 text-xs text-slate-500 text-center font-ne">
                {isNepali 
                  ? "बिन्दुहरूको रङ र ढाँचा नजिकबाट निरीक्षण गर्नुहोस्। बन्द गर्न बाहिर क्लिक गर्नुहोस्।"
                  : "Inspect the colored dots closely. Tap outside or the close icon to return to options."}
              </p>

              <button
                type="button"
                onClick={() => setIsModalZoom(false)}
                className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                {isNepali ? "बन्द गर्नुहोस्" : "Close Inspection"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
