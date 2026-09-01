import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Lock,
  Activity,
  Server,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../i18n/i18nContext';

export const HowItWorksPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 text-xs font-bold shadow-xs">
          <Cpu className="w-3.5 h-3.5" />
          <span>{t('how_it_works.badge')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
          {t('how_it_works.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
          {t('how_it_works.subtitle')}
        </p>
      </div>

      {/* High-Level Architecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 space-y-3 backdrop-blur-xl hover:border-kisan-500/40 transition-all shadow-sm dark:shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">
            {t('how_it_works.arch1_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('how_it_works.arch1_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 space-y-3 backdrop-blur-xl hover:border-amber-500/40 transition-all shadow-sm dark:shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">
            {t('how_it_works.arch2_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('how_it_works.arch2_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 space-y-3 backdrop-blur-xl hover:border-emerald-500/40 transition-all shadow-sm dark:shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">
            {t('how_it_works.arch3_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('how_it_works.arch3_desc')}
          </p>
        </div>
      </div>

      {/* Step by Step Comprehensive Timeline */}
      <div className="space-y-6">
        <div className="text-center pb-2">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            {t('how_it_works.timeline_heading')}
          </h2>
        </div>

        {/* Step 1 */}
        <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-kisan-500/30 transition-all shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-kisan-600 text-white font-black text-base flex items-center justify-center shadow-md">
              1
            </span>
            <div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
                {t('how_it_works.step1_title')}
              </h3>
              <p className="text-xs text-kisan-700 dark:text-kisan-400">
                {t('how_it_works.step1_subtitle')}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-13">
            {t('how_it_works.step1_desc')}
          </p>
          <div className="pl-13 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400">
              {t('how_it_works.step1_b1')}
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400">
              {t('how_it_works.step1_b2')}
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400">
              {t('how_it_works.step1_b3')}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-amber-500/30 transition-all shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-black text-base flex items-center justify-center shadow-md">
              2
            </span>
            <div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
                {t('how_it_works.step2_title')}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {t('how_it_works.step2_subtitle')}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-13">
            {t('how_it_works.step2_desc')}
          </p>
          <div className="pl-13 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400">
              {t('how_it_works.step2_b1')}
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400">
              {t('how_it_works.step2_b2')}
            </div>
            <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400">
              {t('how_it_works.step2_b3')}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-blue-500/30 transition-all shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-blue-500 text-white font-black text-base flex items-center justify-center shadow-md">
              3
            </span>
            <div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
                {t('how_it_works.step3_title')}
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                {t('how_it_works.step3_subtitle')}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-13">
            {t('how_it_works.step3_desc')}
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-purple-500/30 transition-all shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-purple-500 text-white font-black text-base flex items-center justify-center shadow-md">
              4
            </span>
            <div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
                {t('how_it_works.step4_title')}
              </h3>
              <p className="text-xs text-purple-700 dark:text-purple-400">
                {t('how_it_works.step4_subtitle')}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-13">
            {t('how_it_works.step4_desc')}
          </p>
        </div>

        {/* Step 5 */}
        <div className="bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-emerald-500/30 transition-all shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-black text-base flex items-center justify-center shadow-md">
              5
            </span>
            <div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
                {t('how_it_works.step5_title')}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {t('how_it_works.step5_subtitle')}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-13">
            {t('how_it_works.step5_desc')}
          </p>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="bg-gradient-to-r from-kisan-100 via-stone-100 to-kisan-100 dark:from-kisan-950 dark:via-stone-900 dark:to-kisan-950 border border-stone-200 dark:border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-sm dark:shadow-2xl transition-colors">
        <h3 className="font-display font-black text-2xl text-stone-900 dark:text-white">
          {t('how_it_works.cta_heading')}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
          {t('how_it_works.cta_subtitle')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/auth/farmer">
            <Button variant="primary" size="lg" className="bg-kisan-600 hover:bg-kisan-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md">
              {t('how_it_works.cta_login')}
            </Button>
          </Link>
          <Link to="/demo">
            <Button variant="secondary" size="lg" className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-6 py-3 rounded-xl shadow-md">
              {t('how_it_works.cta_demo')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

