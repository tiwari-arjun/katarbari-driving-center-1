import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { RAW_QUESTION_BANK, QUESTION_CATEGORIES, QuestionItem } from '../data/questionBank';
import { TrafficSignVisual } from './TrafficSignVisual';
import { 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Settings2,
  BookOpen,
  Sparkles,
  Layers,
  Clock,
  Shuffle,
  BookmarkCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function QuizEngine() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'ne';
  const isNepali = currentLang === 'ne';

  // Display modes: 'both' | 'en' | 'ne'
  const [examMode, setExamMode] = useState<'en' | 'ne' | 'both'>('both');
  
  // Practice styles: 'quick' | 'mock' | 'category' | 'mistakes'
  const [practiceStyle, setPracticeStyle] = useState<'quick' | 'mock' | 'category' | 'mistakes'>('quick');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<'all' | 'bike' | 'car'>('all');

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('all');

  // Timer for Mock Test mode (30 minutes in seconds: 1800)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800);
  const timerRef = useRef<any>(null);

  // Persistent mistake tracking in localStorage
  const [storedMistakes, setStoredMistakes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('katarbari_mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Prepare question subset based on practice style & filters
  const activeQuestionList: QuestionItem[] = useMemo(() => {
    let pool = RAW_QUESTION_BANK.filter(q => q.verified);

    if (selectedVehicle !== 'all') {
      pool = pool.filter(q => q.vehicleCategory === selectedVehicle || q.vehicleCategory === 'all');
    }

    if (practiceStyle === 'category' && selectedCategory !== 'all') {
      pool = pool.filter(q => q.category === selectedCategory);
    } else if (practiceStyle === 'mistakes') {
      pool = pool.filter(q => storedMistakes.includes(q.id));
      if (pool.length === 0) {
        // Fallback if no mistakes yet
        pool = RAW_QUESTION_BANK.slice(0, 10);
      }
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());

    if (practiceStyle === 'quick') {
      return shuffled.slice(0, 10);
    } else if (practiceStyle === 'mock') {
      return shuffled.slice(0, 20); // DoTM 20-question trial standard
    }

    return shuffled.slice(0, 25);
  }, [practiceStyle, selectedCategory, selectedVehicle, hasStarted, storedMistakes]);

  const currentQ = activeQuestionList[currentIndex] || activeQuestionList[0];

  // Timer effect for Mock mode
  useEffect(() => {
    if (hasStarted && !isFinished && practiceStyle === 'mock') {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [hasStarted, isFinished, practiceStyle]);

  const handleSelectOption = (optId: string) => {
    if (submittedQuestions[currentQ?.id] && practiceStyle !== 'mock') return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleSubmitCurrentAnswer = () => {
    if (!userAnswers[currentQ?.id]) return;
    setSubmittedQuestions(prev => ({ ...prev, [currentQ.id]: true }));

    // Track mistakes
    if (userAnswers[currentQ.id] !== currentQ.correctAnswer) {
      if (!storedMistakes.includes(currentQ.id)) {
        const nextMistakes = [...storedMistakes, currentQ.id];
        setStoredMistakes(nextMistakes);
        try {
          localStorage.setItem('katarbari_mistakes', JSON.stringify(nextMistakes));
        } catch (e) {}
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < activeQuestionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinishExam = () => {
    if (window.confirm(isNepali ? "के तपाईं परीक्षा समाप्त गर्न चाहनुहुन्छ?" : "Are you sure you want to finish the exam now?")) {
      setIsFinished(true);
      clearInterval(timerRef.current);

      // Log practice attempt to server analytics
      try {
        const correctCount = activeQuestionList.filter(q => userAnswers[q.id] === q.correctAnswer).length;
        const missedIds = activeQuestionList.filter(q => userAnswers[q.id] !== q.correctAnswer).map(q => q.id);
        const percentage = Math.round((correctCount / activeQuestionList.length) * 100);
        fetch('/api/analytics/practice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testType: practiceStyle,
            category: selectedCategory,
            score: correctCount,
            totalQuestions: activeQuestionList.length,
            percentage,
            isPassed: percentage >= 70,
            missedQuestionIds: missedIds
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setCurrentIndex(0);
    setIsFinished(false);
    setHasStarted(false);
    setSecondsRemaining(1800);
  };

  // Stats calculation
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    const wrongList: QuestionItem[] = [];

    activeQuestionList.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
        wrongList.push(q);
      }
    });

    const total = activeQuestionList.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const isPassed = percentage >= 70; // Nepal 70% standard

    return { total, correct, wrong, percentage, isPassed, wrongList };
  }, [activeQuestionList, userAnswers]);

  useEffect(() => {
    if (isFinished && stats.isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }
  }, [isFinished, stats.isPassed]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Helper for rendering bilingual question/explanation
  const renderBilingualText = (
    textObj: { en: string; ne: string } | undefined,
    classNameEn = "",
    classNameNe = "font-ne"
  ) => {
    if (!textObj) return null;

    if (examMode === 'en') {
      return <span className={classNameEn}>{textObj.en}</span>;
    }
    if (examMode === 'ne') {
      return <span className={classNameNe}>{textObj.ne}</span>;
    }

    return (
      <div className="flex flex-col space-y-1">
        <span className={`text-slate-900 ${classNameEn}`}>{textObj.en}</span>
        <span className={`text-slate-600 font-ne ${classNameNe}`}>{textObj.ne}</span>
      </div>
    );
  };

  return (
    <section id="practice-test" className="py-20 bg-slate-100 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-100 text-brand-700 font-bold text-xs tracking-wider uppercase rounded-full mb-3 border border-brand-200">
            <BookOpen className="w-3.5 h-3.5" />
            {isNepali ? "नेपाल DoTM आधिकारिक पाठ्यक्रममा आधारित" : "Official Nepal DoTM Syllabus Bank"}
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-ne">
            {t('quizIntro.title')}
          </h2>

          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto font-ne">
            {t('quizIntro.subtitle')}
          </p>

          {/* Official Verification Notice */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-900 font-ne">
            <BookmarkCheck className="w-4 h-4 text-brand-600" />
            <span>
              {isNepali 
                ? "३००+ प्रश्नहरूको संग्रह • १२ वटै आधिकारिक विधा • ७०% उत्तीर्णाङ्क प्रणाली" 
                : "300+ Verified Practice Questions • All 12 Syllabus Modules • 70% Pass Rule"}
            </span>
          </div>
        </div>

        {/* STATE 1: PRACTICE MODE CONFIGURATION SCREEN */}
        {!hasStarted && !isFinished && (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200">
            
            {/* Step 1: Practice Style Selector */}
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 font-ne">
              <Sparkles className="w-5 h-5 text-brand-600" />
              {isNepali ? "अभ्यास मोड छान्नुहोस्:" : "Select Practice Mode:"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                { id: 'quick', titleEn: 'Quick Practice', titleNe: 'शीघ्र अभ्यास (१० प्रश्न)', desc: '10 Questions, immediate explanations' },
                { id: 'mock', titleEn: 'Full Mock Test', titleNe: 'पूर्ण ट्रायल नमुना परीक्षा', desc: '20 Questions, 30 min timer, 70% pass standard' },
                { id: 'category', titleEn: 'Category Practice', titleNe: 'विधागत अभ्यास', desc: 'Study specific syllabus topics' },
                { id: 'mistakes', titleEn: 'Mistake Review', titleNe: 'गल्ती भएका प्रश्न', desc: `${storedMistakes.length} Saved incorrect questions` }
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPracticeStyle(mode.id as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    practiceStyle === mode.id
                      ? 'border-brand-600 bg-brand-50/80 shadow-md ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 font-ne">
                    {isNepali ? mode.titleNe : mode.titleEn}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-ne">
                    {mode.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Step 2: Language Display Selector */}
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 font-ne">
              <Layers className="w-5 h-5 text-brand-600" />
              {t('quizIntro.chooseLanguageLabel')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { id: 'both', labelKey: 'quizIntro.modeBoth', flag: '🇬🇧+🇳🇵' },
                { id: 'ne', labelKey: 'quizIntro.modeNe', flag: '🇳🇵' },
                { id: 'en', labelKey: 'quizIntro.modeEn', flag: '🇬🇧' },
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setExamMode(mode.id as any)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                    examMode === mode.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-xs ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm font-ne">
                    {t(mode.labelKey)}
                  </span>
                  <span className="text-base">{mode.flag}</span>
                </button>
              ))}
            </div>

            {/* Step 3: Vehicle Category */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 font-ne">
                <span>{isNepali ? "सवारी प्रकार:" : "Vehicle Filter:"}</span>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer"
                >
                  <option value="all">{isNepali ? "सबै सवारी (All Vehicles)" : "All Vehicles"}</option>
                  <option value="bike">{isNepali ? "मोटरसाइकल / स्कुटर (Cat A & K)" : "Bike & Scooter"}</option>
                  <option value="car">{isNepali ? "कार / जिप (Category B)" : "Car & Light Vehicle"}</option>
                </select>
              </div>

              {practiceStyle === 'category' && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 font-ne">
                  <span>{isNepali ? "विधा:" : "Category:"}</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer max-w-xs"
                  >
                    {QUESTION_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {isNepali ? cat.ne : cat.en}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                setCurrentIndex(0);
                setHasStarted(true);
                setSecondsRemaining(1800);
              }}
              className="w-full py-4 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-2xl shadow-lg transition-transform active:scale-[0.99] text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer font-ne"
            >
              <span>{t('quizIntro.startBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STATE 2: ACTIVE QUESTION RUNNER */}
        {hasStarted && !isFinished && currentQ && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            
            {/* Top Bar with Question Count, Timer, and Language mode switcher */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {currentIndex + 1} / {activeQuestionList.length}
                </span>

                {practiceStyle === 'mock' && (
                  <div className="flex items-center gap-1.5 bg-red-600/30 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/40">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>
                )}

                <span className="text-xs text-slate-300 font-medium capitalize hidden md:inline">
                  {currentQ.sourceRef}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-28 sm:w-44 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / activeQuestionList.length) * 100}%` }}
                />
              </div>

              {/* Quick toggle mode */}
              <div className="flex items-center gap-2">
                <select
                  value={examMode}
                  onChange={(e) => setExamMode(e.target.value as any)}
                  className="bg-slate-800 text-white text-xs border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="both">🇬🇧 + 🇳🇵 Dual</option>
                  <option value="ne">🇳🇵 Nepali Only</option>
                  <option value="en">🇬🇧 English Only</option>
                </select>
              </div>
            </div>

            {/* Question Body */}
            <div className="p-6 sm:p-8">
              
              {/* Road Sign Vector if present */}
              {currentQ.signSymbol && (
                <div className="mb-6 flex justify-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <TrafficSignVisual
                    symbol={currentQ.signSymbol}
                    signType={currentQ.signType}
                    className="w-28 h-28"
                  />
                </div>
              )}

              {/* Question Text */}
              <div className="text-lg sm:text-xl font-bold mb-6">
                {renderBilingualText(currentQ.question, "text-slate-900 font-bold", "text-slate-800 text-lg sm:text-xl font-semibold")}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map(opt => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;
                  const isChecked = !!submittedQuestions[currentQ.id] || isFinished;
                  const isCorrectAnswer = opt.id === currentQ.correctAnswer;

                  let optionStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-800";

                  if (isSelected && !isChecked) {
                    optionStyle = "border-brand-600 bg-brand-50 ring-2 ring-brand-600/30 text-brand-950";
                  }

                  if (isChecked) {
                    if (isCorrectAnswer) {
                      optionStyle = "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20";
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = "border-red-600 bg-red-50 text-red-950 ring-2 ring-red-500/20";
                    } else {
                      optionStyle = "border-slate-200 opacity-60 bg-slate-50";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isChecked && practiceStyle !== 'mock'}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                    >
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected && !isChecked
                          ? 'bg-brand-600 text-white'
                          : isChecked && isCorrectAnswer
                          ? 'bg-emerald-600 text-white'
                          : isChecked && isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      <div className="flex-1">
                        {renderBilingualText(opt.text, "font-medium text-sm sm:text-base", "font-ne font-medium text-sm sm:text-base")}
                      </div>
                      {isChecked && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isChecked && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback in Quick / Practice Modes */}
              {submittedQuestions[currentQ.id] && (
                <div className={`p-4 rounded-2xl mb-6 border transition-all ${
                  userAnswers[currentQ.id] === currentQ.correctAnswer
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-red-50/90 border-red-300 text-red-950'
                }`}>
                  <div className="font-bold flex items-center gap-2 mb-1.5 font-ne">
                    {userAnswers[currentQ.id] === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-800">{isNepali ? "सही उत्तर!" : "Correct Answer!"}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-800">{isNepali ? "गलत उत्तर" : "Incorrect Answer"}</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm mt-2 pt-2 border-t border-slate-200/60 font-ne">
                    <span className="font-semibold text-xs uppercase tracking-wider block text-slate-600 mb-1">
                      {isNepali ? "व्याख्या तथा नियम:" : "Explanation & DoTM Rule:"}
                    </span>
                    {renderBilingualText(currentQ.explanation, "text-slate-800 text-sm", "text-slate-800 font-ne text-sm")}
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold disabled:opacity-30 hover:bg-slate-100 flex items-center gap-2 cursor-pointer font-ne"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('quiz.prevBtn')}</span>
                </button>

                <div className="flex items-center gap-2">
                  {!submittedQuestions[currentQ.id] && practiceStyle !== 'mock' ? (
                    <button
                      type="button"
                      disabled={!userAnswers[currentQ.id]}
                      onClick={handleSubmitCurrentAnswer}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer font-ne"
                    >
                      {t('quiz.submitBtn')}
                    </button>
                  ) : currentIndex < activeQuestionList.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-1.5 cursor-pointer font-ne"
                    >
                      <span>{t('quiz.nextBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleFinishExam}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-sm transition cursor-pointer font-ne"
                  >
                    {t('quiz.finishBtn')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STATE 3: RESULTS SUMMARY SCREEN */}
        {isFinished && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className={`p-8 text-center text-white ${stats.isPassed ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-rose-600 to-red-700'}`}>
              <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                {stats.isPassed ? '🏆' : '⚠️'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-1 font-ne">
                {stats.isPassed 
                  ? (isNepali ? "बधाई छ! तपाईं उत्तीर्ण हुनुभयो (PASSED)" : "Congratulations! PASSED (70%+)") 
                  : (isNepali ? "थप अभ्यास आवश्यक (Needs Practice)" : "NEEDS PRACTICE - Review mistakes and retry")}
              </h3>
              <p className="text-white/90 text-sm font-ne">
                {isNepali ? "नेपाल DoTM ७० अंक प्रणाली अनुसारको नतिजा" : "Evaluation under Nepal DoTM 70% passing threshold"}
              </p>
            </div>

            <div className="p-6 sm:p-10">
              
              {/* Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold font-ne">{t('quiz.totalQuestions')}</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{stats.total}</div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <span className="text-xs text-emerald-700 uppercase font-semibold font-ne">{t('quiz.correctAnswers')}</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{stats.correct}</div>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
                  <span className="text-xs text-red-600 uppercase font-semibold font-ne">{t('quiz.wrongAnswers')}</span>
                  <div className="text-2xl font-black text-red-700 mt-1">{stats.wrong}</div>
                </div>
                <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-center">
                  <span className="text-xs text-brand-700 uppercase font-semibold font-ne">{t('quiz.percentage')}</span>
                  <div className="text-2xl font-black text-brand-800 mt-1">{stats.percentage}%</div>
                </div>
              </div>

              {/* Review Filter */}
              <div className="flex gap-3 mb-6 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer font-ne ${
                    reviewFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {t('quiz.allQuestionsBtn')} ({activeQuestionList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('wrong')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer font-ne ${
                    reviewFilter === 'wrong' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {t('quiz.reviewWrongBtn')} ({stats.wrong})
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-8">
                {(reviewFilter === 'wrong' ? stats.wrongList : activeQuestionList).map((q) => {
                  const userAns = userAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/70">
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold text-white shrink-0 mt-0.5 ${isCorrect ? 'bg-emerald-600' : 'bg-red-600'}`}>
                          {isCorrect ? '✓' : '✕'}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 mb-2">
                            {renderBilingualText(q.question, "text-sm", "text-sm font-ne")}
                          </div>
                          <div className="text-xs text-slate-600 space-y-1 font-ne">
                            <div>
                              <strong>{isNepali ? "तपाईंको उत्तर:" : "Your Answer:"}</strong>{' '}
                              {userAns ? (
                                <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                                  {userAns.toUpperCase()} - {q.options.find(o => o.id === userAns)?.text[isNepali ? 'ne' : 'en']}
                                </span>
                              ) : (
                                <span className="italic text-slate-400">{isNepali ? "उत्तर नदिएको" : "Unanswered"}</span>
                              )}
                            </div>
                            {!isCorrect && (
                              <div className="text-emerald-700 font-bold">
                                {isNepali ? "सही उत्तर:" : "Correct Answer:"} {q.correctAnswer.toUpperCase()} - {q.options.find(o => o.id === q.correctAnswer)?.text[isNepali ? 'ne' : 'en']}
                              </div>
                            )}
                            <div className="text-slate-500 pt-1">
                              {renderBilingualText(q.explanation, "text-xs", "text-xs font-ne")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-center transition shadow-md flex items-center justify-center gap-2 cursor-pointer font-ne"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('quiz.retakeBtn')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRetake();
                    setHasStarted(false);
                  }}
                  className="px-6 py-3.5 border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold rounded-xl text-center transition cursor-pointer font-ne"
                >
                  {t('quiz.backToConfig')}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
