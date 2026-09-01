import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Ticket,
  Clock,
  CheckCircle2,
  Bell,
  Mic,
  Phone,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Users,
  Building2,
  Sparkles,
  ChevronRight,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Play,
  RotateCcw,
  Check,
  HelpCircle,
  Truck,
  Landmark,
  Scale,
  Shield,
  FileSpreadsheet,
  ArrowUpRight,
  HeartHandshake,
  DollarSign,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useI18n } from '../../i18n/i18nContext';

export const LandingPage: React.FC = () => {
  const { t, currentLanguageInfo, language } = useI18n();

  // Interactive Live Simulator State
  const [selectedMandi, setSelectedMandi] = useState('balasore');
  const [selectedCrop, setSelectedCrop] = useState('Paddy');
  const [selectedVehicle, setSelectedVehicle] = useState('Tractor');
  const [isSimulating, setIsSimulating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<{
    number: string;
    mandiName: string;
    slotTime: string;
    queueAhead: number;
    estimatedWait: string;
    gatePass: string;
  } | null>({
    number: 'A-142',
    mandiName: 'Balasore Procurement Mandi (ବାଲେଶ୍ୱର ମଣ୍ଡି)',
    slotTime: '09:30 AM - 10:00 AM',
    queueAhead: 4,
    estimatedWait: '18 mins',
    gatePass: 'GP-2026-8891'
  });

  // Interactive Step Stepper State
  const [activeStep, setActiveStep] = useState(1);

  // Audio / Voice Assistant Showcase State
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('hi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // ROI Calculator State
  const [quintals, setQuintals] = useState(80);
  const [distanceKm, setDistanceKm] = useState(15);

  // Stakeholder Active Tab
  const [activePersona, setActivePersona] = useState<'farmer' | 'officer' | 'admin' | 'auditor'>('farmer');

  // Handle Simulator Token Generation
  const handleGenerateSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mandis: Record<string, string> = {
        balasore: 'Balasore Mandi Hub (ବାଲେଶ୍ୱର)',
        karnal: 'Karnal Grain Market (करनाल)',
        indore: 'Indore Mandi Center (इंदौर)',
        varanasi: 'Varanasi Marketing Hub (वाराणसी)',
      };
      const randomNum = Math.floor(100 + Math.random() * 900);
      const tokenLetters = ['A', 'B', 'C', 'T'];
      const randomLetter = tokenLetters[Math.floor(Math.random() * tokenLetters.length)];

      setGeneratedToken({
        number: `${randomLetter}-${randomNum}`,
        mandiName: mandis[selectedMandi] || 'Procurement Center',
        slotTime: '10:15 AM - 10:45 AM',
        queueAhead: Math.floor(2 + Math.random() * 6),
        estimatedWait: `${12 + Math.floor(Math.random() * 15)} ${t('sim.mins')}`,
        gatePass: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`
      });
      setIsSimulating(false);
    }, 600);
  };

  // Voice Samples data
  const voiceSamples: Record<string, { query: string; response: string; langName: string; audioLabel: string }> = {
    hi: {
      langName: 'हिन्दी (Hindi)',
      query: '“मुझे कल सुबह 10 बजे धान बेचने के लिए बालासोर मंडी में स्लॉट चाहिए।”',
      response: '“नमस्ते रामेश्वर जी! बालासोर केंद्र पर कल सुबह 10:00 बजे का स्लॉट उपलब्ध है। टोकन A-142 आरक्षित कर दिया गया है।”',
      audioLabel: 'सुनें (Play Audio Sample)'
    },
    en: {
      langName: 'English',
      query: '“I need a slot to sell paddy tomorrow at 10 AM in Balasore Mandi.”',
      response: '“Hello Farmer Friend! A slot is available tomorrow at 10:00 AM in Balasore Mandi. Digital token A-142 has been confirmed.”',
      audioLabel: 'Play Audio Sample'
    },
    or: {
      langName: 'ଓଡ଼ିଆ (Odia)',
      query: '“ମୋତେ କାଲି ସକାଳେ ଧାନ ବିକ୍ରି ପାଇଁ ବାଲେଶ୍ୱର ମଣ୍ଡିରେ ସ୍ଲଟ୍ ଦରକାର।”',
      response: '“ନମସ୍କାର! ବାଲେଶ୍ୱର ମଣ୍ଡିରେ କାଲି ସକାଳ ୧୦:୦୦ ଟାରେ ସ୍ଲଟ୍ ଉପଲବ୍ଧ। ଟୋକନ୍ A-142 ସଂରକ୍ଷିତ ହୋଇଛି।”',
      audioLabel: 'ଶୁଣନ୍ତୁ (Play Audio)'
    },
    pa: {
      langName: 'ਪੰਜਾਬੀ (Punjabi)',
      query: '“ਮੈਨੂੰ ਕੱਲ੍ਹ ਸਵੇਰੇ 10 ਵਜੇ ਕਣਕ ਵੇਚਣ ਲਈ ਕਰਨਾਲ ਮੰਡੀ ਵਿੱਚ ਸਲਾਟ ਚਾਹੀਦਾ ਹੈ।”',
      response: '“ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਕਰਨਾਲ ਮੰਡੀ ਵਿਖੇ ਕੱਲ੍ਹ ਸਵੇਰੇ 10:00 ਵਜੇ ਦਾ ਸਲਾਟ ਬੁੱਕ ਹੋ ਗਿਆ ਹੈ। ਟੋਕਨ A-142 ਜਾਰੀ ਹੈ।”',
      audioLabel: 'ਸੁਣੋ (Play Audio)'
    },
    bn: {
      langName: 'বাংলা (Bengali)',
      query: '“আমি আগামীকাল সকালে ধান বিক্রির জন্য মান্ডি স্লট বুক করতে চাই।”',
      response: '“নমস্কার! আপনার ধান বিক্রির স্লট নির্ধারিত হয়েছে। ডিজিটাল টোকেন নম্বর A-142 নিশ্চিত করা হলো।”',
      audioLabel: 'শুনুন (Play Audio)'
    },
    mr: {
      langName: 'मराठी (Marathi)',
      query: '“मला उद्या सकाळी 10 वाजता धान्य विक्रीसाठी इंदूर मंडीमध्ये स्लॉट हवा आहे.”',
      response: '“नमस्कार! इंदूर मंडीमध्ये उद्या सकाळी 10:00 वाजता स्लॉट उपलब्ध आहे. डिजिटल टोकन A-142 निश्चित केले आहे.”',
      audioLabel: 'ऐका (Play Audio)'
    }
  };

  const currentVoice = voiceSamples[selectedVoiceLang] || voiceSamples['hi'];

  // Toggle Voice Simulation playback
  const handleToggleVoice = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentVoice.response);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // ROI Math
  const hoursSaved = Math.round((quintals * 0.15 + distanceKm * 0.4) * 10) / 10;
  const dieselSavings = Math.round(distanceKm * 2 * 35 + 400);
  const spoilageSavings = Math.round(quintals * 45);
  const totalBenefit = dieselSavings + spoilageSavings;

  return (
    <div className="space-y-24 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 overflow-hidden">
      {/* ========================================================
          1. HERO SECTION WITH AMBIENT PARTICLES & LIVE SIMULATOR
          ======================================================== */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-8 pb-20 px-4 sm:px-6 bg-radial-gradient">
        {/* Dynamic Glow Meshes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-kisan-400/20 via-kisan-500/10 to-amber-500/10 dark:from-kisan-600/20 dark:via-kisan-500/10 dark:to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-kisan-700/10 dark:bg-kisan-700/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Live Running Transparency Marquee */}
        <div className="max-w-6xl mx-auto w-full mb-8">
          <div className="bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-2xl p-2.5 backdrop-blur-xl flex items-center gap-3 overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-800 dark:text-kisan-300 text-xs font-bold shrink-0">
              <Radio className="w-3.5 h-3.5 text-kisan-600 dark:text-kisan-400 animate-pulse" />
              <span>{t('marquee.pulse_label')}</span>
            </div>
            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <div className="inline-block animate-marquee text-xs text-stone-700 dark:text-stone-300 font-medium">
                {t('marquee.text')}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left: Strategic Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* SIH Shield Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 border border-kisan-200 dark:border-kisan-500/30 text-stone-800 dark:text-stone-200 text-xs font-semibold backdrop-blur-md shadow-sm dark:shadow-lg transition-colors">
              <ShieldCheck className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-stone-900 dark:text-white">
                <span className="text-gradient-emerald">{t('brand.name')}</span>
              </h1>
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-600 dark:text-gradient-gold tracking-tight">
                “{t('brand.tagline')}”
              </div>
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl font-normal leading-relaxed">
                {t('hero.desc')}
              </p>
            </div>

            {/* Quick Feature Metric Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 p-3.5 rounded-2xl backdrop-blur-md shadow-xs dark:shadow-none transition-colors">
                <div className="text-xl sm:text-2xl font-display font-black text-amber-600 dark:text-amber-400">{t('hero.metric_wait_val')}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{t('hero.metric_wait_lbl')}</div>
              </div>
              <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 p-3.5 rounded-2xl backdrop-blur-md shadow-xs dark:shadow-none transition-colors">
                <div className="text-xl sm:text-2xl font-display font-black text-kisan-600 dark:text-kisan-400">{t('hero.metric_lang_val')}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{t('hero.metric_lang_lbl')}</div>
              </div>
              <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 p-3.5 rounded-2xl backdrop-blur-md shadow-xs dark:shadow-none transition-colors">
                <div className="text-xl sm:text-2xl font-display font-black text-emerald-600 dark:text-emerald-400">{t('hero.metric_dbt_val')}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{t('hero.metric_dbt_lbl')}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <Link to="/auth/farmer">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-kisan-600 to-kisan-500 hover:from-kisan-500 hover:to-kisan-400 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-kisan-900/30 border border-kisan-400/40 flex items-center gap-2 group transform hover:-translate-y-0.5 transition-all"
                >
                  <span>{t('hero.cta_farmer')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/demo">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm px-6 py-4 rounded-2xl shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>{t('hero.cta_demo')}</span>
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-stone-300 dark:border-white/15 hover:border-stone-400 dark:hover:border-white/30 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white/70 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-800/80 text-sm px-5 py-4 rounded-2xl backdrop-blur-md transition-colors"
                >
                  {t('hero.cta_workflow')}
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Right: Interactive Live Mandi Simulator Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-kisan-500 to-amber-500 rounded-3xl blur-xl opacity-20 dark:opacity-30 group-hover:opacity-100 transition duration-1000"></div>

              <div className="relative bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-white/15 rounded-3xl p-6 backdrop-blur-2xl shadow-xl dark:shadow-2xl space-y-5 transition-colors">
                {/* Simulator Header */}
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-kisan-100 dark:bg-kisan-900/80 border border-kisan-200 dark:border-kisan-500/40 flex items-center justify-center text-kisan-700 dark:text-kisan-300">
                      <Zap className="w-4 h-4 text-kisan-600 dark:text-kisan-400 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-stone-900 dark:text-white">
                        {t('sim.header_title')}
                      </h3>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">{t('sim.header_desc')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {t('sim.active')}
                  </span>
                </div>

                {/* Simulator Controls */}
                <div className="space-y-3 text-xs">
                  {/* Select Mandi */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {t('sim.mandi_label')}
                    </label>
                    <select
                      value={selectedMandi}
                      onChange={(e) => setSelectedMandi(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-kisan-500 transition-colors"
                    >
                      <option value="balasore">{t('sim.mandi_opt1')}</option>
                      <option value="karnal">{t('sim.mandi_opt2')}</option>
                      <option value="indore">{t('sim.mandi_opt3')}</option>
                      <option value="varanasi">{t('sim.mandi_opt4')}</option>
                    </select>
                  </div>

                  {/* Select Crop & Vehicle in Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {t('sim.crop_label')}
                      </label>
                      <select
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-kisan-500 transition-colors"
                      >
                        <option value="Paddy">{t('sim.crop_paddy')}</option>
                        <option value="Wheat">{t('sim.crop_wheat')}</option>
                        <option value="Mustard">{t('sim.crop_mustard')}</option>
                        <option value="Maize">{t('sim.crop_maize')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {t('sim.vehicle_label')}
                      </label>
                      <select
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-xs text-stone-900 dark:text-white focus:outline-hidden focus:border-kisan-500 transition-colors"
                      >
                        <option value="Tractor">{t('sim.veh_tractor')}</option>
                        <option value="Pickup">{t('sim.veh_pickup')}</option>
                        <option value="Cart">{t('sim.veh_cart')}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateSimulation}
                    disabled={isSimulating}
                    className="w-full py-2.5 bg-gradient-to-r from-kisan-600 to-kisan-500 hover:from-kisan-500 hover:to-kisan-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isSimulating ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>{t('sim.btn_simulating')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{t('sim.btn_book')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Digital Token Preview Card */}
                {generatedToken && (
                  <div className="bg-stone-100 dark:bg-stone-950/90 border border-kisan-300 dark:border-kisan-500/40 rounded-2xl p-4 space-y-3 animate-fadeIn shadow-inner transition-colors">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                          {t('sim.pass_title')}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">{generatedToken.gatePass}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">{t('sim.token_no_lbl')}</div>
                        <div className="text-2xl font-display font-black text-amber-600 dark:text-amber-400 tracking-wider">
                          {generatedToken.number}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">{t('sim.arrival_lbl')}</div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white bg-white dark:bg-stone-900 px-2 py-1 rounded-lg border border-stone-200 dark:border-white/10">
                          {generatedToken.slotTime}
                        </div>
                      </div>
                    </div>

                    {/* Live Queue Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-stone-600 dark:text-stone-400">{t('sim.queue_ahead_lbl')} <strong className="text-stone-900 dark:text-stone-200">{generatedToken.queueAhead}</strong></span>
                        <span className="text-kisan-700 dark:text-kisan-400 font-bold">{t('sim.est_wait_lbl')} ~{generatedToken.estimatedWait}</span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-300 dark:border-white/5">
                        <div className="bg-gradient-to-r from-amber-500 to-kisan-500 h-2 rounded-full w-4/5 animate-pulse" />
                      </div>
                    </div>

                    <div className="text-[10px] text-stone-600 dark:text-stone-400 bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl flex items-center justify-between border border-stone-200 dark:border-transparent">
                      <span className="truncate">📍 {generatedToken.mandiName}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">{t('sim.verified_badge')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE 5-STEP INTERACTIVE TRANSPARENT JOURNEY
          ======================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('journey.badge')}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white">
            {t('journey.title')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('journey.subtitle')}
          </p>
        </div>

        {/* Step Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { step: 1, title: t('journey.step1_title'), sub: t('journey.step1_sub'), icon: Search },
            { step: 2, title: t('journey.step2_title'), sub: t('journey.step2_sub'), icon: Calendar },
            { step: 3, title: t('journey.step3_title'), sub: t('journey.step3_sub'), icon: Ticket },
            { step: 4, title: t('journey.step4_title'), sub: t('journey.step4_sub'), icon: Clock },
            { step: 5, title: t('journey.step5_title'), sub: t('journey.step5_sub'), icon: DollarSign },
          ].map((item) => {
            const isCurrent = activeStep === item.step;
            const Icon = item.icon;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                  isCurrent
                    ? 'border-kisan-500 bg-kisan-50 dark:bg-kisan-950/90 shadow-md ring-2 ring-kisan-500/30'
                    : 'border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900/60 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCurrent ? 'bg-kisan-600 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-400'
                    }`}
                  >
                    {item.step}
                  </div>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-stone-500'}`} />
                </div>
                <div>
                  <div className="font-display font-bold text-xs text-stone-900 dark:text-white">{item.title}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Feature Display Card */}
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-lg dark:shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <span>Step {activeStep} Details</span>
            </div>

            {activeStep === 1 && (
              <>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  1. Center Discovery & Predictive Load Balancing
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Farmers can check all government procurement centers in their district, real-time operating hours, and live waiting queues. If a center is crowded, the system suggests alternative nearby centers.
                </p>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>GPS-based distance and travel routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>Active weighbridges and live capacity percentage</span>
                  </li>
                </ul>
              </>
            )}

            {activeStep === 2 && (
              <>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  2. Concurrency-Safe Slot Booking
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Farmers schedule arrival based on their crop quantity and vehicle type. Database row-level locking ensures no double booking or queue crowding.
                </p>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>20-minute arrival windows to prevent road traffic jams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>Allocated by vehicle type (Tractor, Pickup, Cart)</span>
                  </li>
                </ul>
              </>
            )}

            {activeStep === 3 && (
              <>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  3. Guaranteed Immutable Digital Token (A-142)
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Instant digital token pass with gate-pass code, recommended arrival window, and SMS delivery for offline accessibility.
                </p>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>100% prevention of queue jumping and middlemen tampering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>Instant SMS for basic keypad phone users</span>
                  </li>
                </ul>
              </>
            )}

            {activeStep === 4 && (
              <>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  4. Live Radar Queue Tracking
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Real-time visibility into active weighing tokens (e.g. Counter 1: A-138). Farmers receive automated alerts to arrive only when their turn is near.
                </p>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>“3 farmers ahead of you, please head to mandi” live alert</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>Unified status across Web, SMS, and 1800 IVR</span>
                  </li>
                </ul>
              </>
            )}

            {activeStep === 5 && (
              <>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  5. Automated Weighing, Moisture Grading & Direct PFMS DBT
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Electronic weighbridge and moisture meter record live readings. Digital slip automatically initiates direct bank transfer via PFMS within 24 to 48 hours.
                </p>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>Tamper-proof digital audit log with officer ID and timestamps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />
                    <span>24-48 hours direct Aadhaar-linked bank transfer</span>
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* Step Right Side Visual Box */}
          <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-200 dark:border-white/10">
              <span className="font-mono">Step {activeStep} Simulation</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">● Live Telemetry</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-white/5">
                <span className="text-stone-500 dark:text-stone-400">Active Mandi:</span>
                <strong className="text-stone-900 dark:text-white">Balasore Procurement Hub</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-white/5">
                <span className="text-stone-500 dark:text-stone-400">Daily Capacity Utilization:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">68% (Optimal Zone)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-white/5">
                <span className="text-stone-500 dark:text-stone-400">Avg Weighing Speed:</span>
                <strong className="text-amber-600 dark:text-amber-400">7.2 mins per vehicle</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-white/5">
                <span className="text-stone-500 dark:text-stone-400">DBT Success Rate:</span>
                <strong className="text-kisan-700 dark:text-kisan-400">99.8% (Zero Middlemen)</strong>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/how-it-works">
                <Button variant="outline" size="sm" className="w-full border-stone-300 dark:border-white/15 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs">
                  View Full System Architecture →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CHAOS VS CLARITY: SIDE-BY-SIDE TRANSFORMATION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="neutral" className="bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300">
            {t('compare.badge')}
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
            {t('compare.title')}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {t('compare.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Traditional Way Card */}
          <div className="bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between backdrop-blur-xl shadow-xs transition-colors">
            <div>
              <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400 font-display font-extrabold text-lg mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <span>{t('compare.prob_title')}</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>{t('compare.prob_1_title')}</strong> {t('compare.prob_1_desc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>{t('compare.prob_2_title')}</strong> {t('compare.prob_2_desc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>{t('compare.prob_3_title')}</strong> {t('compare.prob_3_desc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>{t('compare.prob_4_title')}</strong> {t('compare.prob_4_desc')}</span>
                </li>
              </ul>
            </div>
            <div className="bg-red-100/80 dark:bg-red-950/80 border border-red-200 dark:border-red-800/40 p-3 rounded-2xl text-xs text-red-900 dark:text-red-300 font-semibold text-center">
              {t('compare.prob_result')}
            </div>
          </div>

          {/* Kisan Pehele Way Card */}
          <div className="bg-kisan-50/70 dark:bg-kisan-950/40 border border-kisan-300 dark:border-kisan-500/40 rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between backdrop-blur-xl shadow-md dark:shadow-xl dark:shadow-kisan-950/60 relative transition-colors">
            <div className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full bg-kisan-600 text-white dark:bg-kisan-500 dark:text-stone-950">
              {t('compare.sol_badge')}
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-kisan-800 dark:text-kisan-300 font-display font-extrabold text-lg mb-4">
                <CheckCircle2 className="w-6 h-6 text-kisan-600 dark:text-kisan-400" />
                <span>{t('compare.sol_title')}</span>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-kisan-200 dark:bg-kisan-900 text-kisan-800 dark:text-kisan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>{t('compare.sol_1_title')}</strong> {t('compare.sol_1_desc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-kisan-200 dark:bg-kisan-900 text-kisan-800 dark:text-kisan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>{t('compare.sol_2_title')}</strong> {t('compare.sol_2_desc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-kisan-200 dark:bg-kisan-900 text-kisan-800 dark:text-kisan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>{t('compare.sol_3_title')}</strong> {t('compare.sol_3_desc')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-kisan-200 dark:bg-kisan-900 text-kisan-800 dark:text-kisan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>{t('compare.sol_4_title')}</strong> {t('compare.sol_4_desc')}</span>
                </li>
              </ul>
            </div>
            <div className="bg-kisan-100 dark:bg-kisan-900/80 border border-kisan-300 dark:border-kisan-600/40 p-3 rounded-2xl text-xs text-kisan-900 dark:text-kisan-200 font-bold text-center">
              {t('compare.sol_result')}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. 22-LANGUAGE VOICE ASSISTANT LIVE INTERACTIVE DEMO
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-stone-100 via-kisan-50 to-stone-100 dark:from-stone-900 dark:via-kisan-950 dark:to-stone-900 border border-stone-200 dark:border-white/15 rounded-3xl p-6 sm:p-12 backdrop-blur-2xl shadow-lg dark:shadow-2xl relative overflow-hidden space-y-8 transition-colors">
          {/* Top Voice Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kisan-100 dark:bg-kisan-900/80 border border-kisan-300 dark:border-kisan-500/40 text-kisan-800 dark:text-kisan-400 text-xs font-bold">
              <Mic className="w-3.5 h-3.5 text-kisan-600 dark:text-kisan-400 animate-pulse" />
              <span>{t('voice.badge')}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
              {t('voice.title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              {t('voice.subtitle')}
            </p>
          </div>

          {/* Language Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.entries(voiceSamples).map(([key, data]) => {
              const isSelected = selectedVoiceLang === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedVoiceLang(key);
                    setIsPlayingAudio(false);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-kisan-600 dark:bg-kisan-500 text-white dark:text-stone-950 shadow-md font-black scale-105'
                      : 'bg-white dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-white/5'
                  }`}
                >
                  {data.langName}
                </button>
              );
            })}
          </div>

          {/* Voice Interaction Mockup Box */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-stone-950/90 border border-stone-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-inner transition-colors">
            {/* Farmer Utterance */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                👨‍🌾
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">{t('voice.farmer_speaks')}</div>
                <div className="text-sm sm:text-base text-stone-900 dark:text-white italic font-medium bg-stone-50 dark:bg-stone-900/90 p-3 rounded-2xl border border-stone-200 dark:border-white/5">
                  {currentVoice.query}
                </div>
              </div>
            </div>

            {/* AI Waveform & Play Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-kisan-50 dark:bg-kisan-950/80 border border-kisan-200 dark:border-kisan-500/30 p-4 rounded-2xl transition-colors">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleToggleVoice}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer shrink-0 ${
                    isPlayingAudio
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-kisan-600 to-kisan-500 text-white'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-white">
                    {isPlayingAudio ? t('voice.playing_audio') : currentVoice.audioLabel}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400">{t('voice.audio_sub')}</div>
                </div>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center gap-1.5 h-8 px-4 py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-white/5">
                <div className={`w-1.5 bg-kisan-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-1' : 'opacity-40'}`} />
                <div className={`w-1.5 bg-kisan-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-2' : 'opacity-40'}`} />
                <div className={`w-1.5 bg-kisan-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-3' : 'opacity-40'}`} />
                <div className={`w-1.5 bg-amber-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-4' : 'opacity-40'}`} />
                <div className={`w-1.5 bg-kisan-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-5' : 'opacity-40'}`} />
                <div className={`w-1.5 bg-kisan-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-2' : 'opacity-40'}`} />
                <div className={`w-1.5 bg-kisan-500 rounded-full h-full ${isPlayingAudio ? 'wave-bar-1' : 'opacity-40'}`} />
              </div>
            </div>

            {/* AI Assistant Answer */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-kisan-100 dark:bg-kisan-500/20 border border-kisan-300 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-bold text-sm shrink-0">
                🤖
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-kisan-700 dark:text-kisan-400">{t('voice.assistant_responds')}</div>
                <div className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/90 p-3 rounded-2xl border border-stone-200 dark:border-white/5">
                  {currentVoice.response}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. INTERACTIVE ROI & SAVINGS CALCULATOR
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-lg dark:shadow-2xl space-y-8 transition-colors">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('roi.badge')}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
              {t('roi.title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              {t('roi.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Input Sliders */}
            <div className="lg:col-span-6 space-y-6 bg-stone-50 dark:bg-stone-950 p-6 rounded-2xl border border-stone-200 dark:border-white/10 transition-colors">
              {/* Quintals Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300">{t('roi.qty_label')}</span>
                  <span className="font-display font-black text-base text-amber-600 dark:text-amber-400">{quintals} {t('roi.qtl')}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={5}
                  value={quintals}
                  onChange={(e) => setQuintals(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500">
                  <span>10 {t('roi.qtl')}</span>
                  <span>150 {t('roi.qtl')}</span>
                  <span>300 {t('roi.qtl')}</span>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300">{t('roi.dist_label')}</span>
                  <span className="font-display font-black text-base text-kisan-700 dark:text-kisan-400">{distanceKm} {t('roi.km')}</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={60}
                  step={1}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-kisan-500"
                />
                <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500">
                  <span>2 {t('roi.km')}</span>
                  <span>30 {t('roi.km')}</span>
                  <span>60 {t('roi.km')}</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Metrics Cards */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/10 space-y-1 transition-colors">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t('roi.hours_saved_title')}</span>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  ~{hoursSaved} hrs
                </div>
                <div className="text-[10px] text-stone-400 dark:text-stone-500">{t('roi.hours_saved_desc')}</div>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/10 space-y-1 transition-colors">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-kisan-600 dark:text-kisan-400" />
                  <span>{t('roi.diesel_saved_title')}</span>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-kisan-700 dark:text-kisan-400">
                  ₹{dieselSavings}
                </div>
                <div className="text-[10px] text-stone-400 dark:text-stone-500">{t('roi.diesel_saved_desc')}</div>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/10 space-y-1 transition-colors">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t('roi.spoilage_saved_title')}</span>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  ₹{spoilageSavings}
                </div>
                <div className="text-[10px] text-stone-400 dark:text-stone-500">{t('roi.spoilage_saved_desc')}</div>
              </div>

              <div className="bg-kisan-100 dark:bg-gradient-to-br dark:from-kisan-950 dark:to-stone-950 p-4 rounded-2xl border border-kisan-300 dark:border-kisan-500/40 space-y-1 transition-colors">
                <div className="text-[11px] text-kisan-800 dark:text-kisan-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-kisan-600 dark:text-kisan-400" />
                  <span>{t('roi.total_benefit_title')}</span>
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white text-gradient-gold">
                  ₹{totalBenefit}
                </div>
                <div className="text-[10px] text-kisan-700 dark:text-kisan-400 font-medium">{t('roi.total_benefit_desc')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. STAKEHOLDER ECOSYSTEM (FARMER, OFFICER, ADMIN, AUDITOR)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <Badge variant="neutral" className="bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300">
            {t('stakeholder.badge')}
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
            {t('stakeholder.title')}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {t('stakeholder.subtitle')}
          </p>
        </div>

        {/* Stakeholder Switcher Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-white/10 gap-1 overflow-x-auto max-w-full transition-colors">
            {[
              { id: 'farmer', label: t('stakeholder.tab_farmer'), role: 'Farmer' },
              { id: 'officer', label: t('stakeholder.tab_officer'), role: 'Mandi Officer' },
              { id: 'admin', label: t('stakeholder.tab_admin'), role: 'Collector & Admin' },
              { id: 'auditor', label: t('stakeholder.tab_auditor'), role: 'Auditor' },
            ].map((p) => {
              const isActive = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-kisan-600 text-white shadow-md font-black'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stakeholder Active Content Box */}
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-lg dark:shadow-2xl transition-colors">
          {activePersona === 'farmer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-kisan-100 dark:bg-kisan-900/60 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-bold">
                  <Mic className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">22 Languages Voice Booking</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Book slots effortlessly without typing. Receive spoken audio confirmation of your token and slot window.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Keypad Phone IVR & SMS</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Call toll-free 1800-180-1551 to check live queue status without internet, and get immediate SMS tokens.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Trusted Helper Representative</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Elderly farmers can authorize family members to handle physical delivery while DBT money stays locked to the farmer’s account.
                </p>
              </div>
            </div>
          )}

          {activePersona === 'officer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Digital Weighbridge & Moisture</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Direct digital logging of electronic scale weights and moisture meter percentages with zero paper friction.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-kisan-100 dark:bg-kisan-900/60 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Queue Throughput Pacing</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Pace farmer arrivals to match scale capacity, eliminating bottlenecks in the mandi yard.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Automated DBT Trigger</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Digitally approved weighing slips trigger payment dispatch orders instantly to the PFMS gateway.
                </p>
              </div>
            </div>
          )}

          {activePersona === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">District-Wide Real-Time Telemetry</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Track arrivals, procurement quotas, and DBT payment clearance across all district centers in real time.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Congestion Early-Warning</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Automated notifications when wait times exceed thresholds, allowing dynamic load balancing to adjacent centers.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">One-Click Compliance Reporting</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Export verified CAG and Ministry-compliant daily procurement and disbursement summaries.
                </p>
              </div>
            </div>
          )}

          {activePersona === 'auditor' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Immutable Cryptographic Audit Trail</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Every token creation, slot reschedule, scale reading, and bank disbursement is permanently logged with digital signatures.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">Anomaly & Fraud Detection</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Automated AI flags repeated vehicle registrations, moisture grading discrepancies, and unusual cancellation spikes.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200 dark:border-white/10 space-y-3 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-kisan-100 dark:bg-kisan-900/60 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-base text-stone-900 dark:text-white">100% Statutory Integrity</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Fully aligned with CAG public financial auditing standards for zero leakages.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          7. CALL TO ACTION FOOTER BANNER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-gradient-to-r from-kisan-800 via-kisan-900 to-kisan-950 dark:from-kisan-950 dark:via-kisan-900 dark:to-kisan-950 border border-kisan-500/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden text-white transition-colors">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-kisan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('cta.badge')}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              {t('cta.desc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link to="/auth/farmer">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-amber-950/60 border border-amber-300/40 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
              >
                <span>{t('cta.btn_farmer')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 hover:border-white/40 text-white bg-stone-900/60 hover:bg-stone-800 text-sm px-6 py-4 rounded-2xl backdrop-blur-md"
              >
                {t('cta.btn_demo')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
