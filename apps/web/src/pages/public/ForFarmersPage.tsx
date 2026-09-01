import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Phone,
  Ticket,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../i18n/i18nContext';

export const ForFarmersPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('for_farmers.badge')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
          {t('for_farmers.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
          {t('for_farmers.subtitle')}
        </p>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Voice AI */}
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-kisan-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-black text-xl">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-stone-900 dark:text-white">
            {t('for_farmers.pillar1_title')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('for_farmers.pillar1_desc')}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-white/5 text-xs text-amber-700 dark:text-amber-300 italic">
            {t('for_farmers.pillar1_quote')}
          </div>
        </div>

        {/* Pillar 2: Fixed Digital Token */}
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-xl">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-stone-900 dark:text-white">
            {t('for_farmers.pillar2_title')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('for_farmers.pillar2_desc')}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-white/5 text-xs text-kisan-800 dark:text-kisan-300 font-semibold">
            {t('for_farmers.pillar2_tag')}
          </div>
        </div>

        {/* Pillar 3: Non-Smart Phone Support */}
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-black text-xl">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-stone-900 dark:text-white">
            {t('for_farmers.pillar3_title')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('for_farmers.pillar3_desc')}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-white/5 text-xs text-blue-700 dark:text-blue-300 font-medium">
            {t('for_farmers.pillar3_tag')}
          </div>
        </div>

        {/* Pillar 4: Trusted Helper */}
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-purple-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-400 flex items-center justify-center font-black text-xl">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-xl text-stone-900 dark:text-white">
            {t('for_farmers.pillar4_title')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('for_farmers.pillar4_desc')}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-white/5 text-xs text-purple-700 dark:text-purple-300 font-medium">
            {t('for_farmers.pillar4_tag')}
          </div>
        </div>
      </div>

      {/* Farmer Rights & MSP Transparency Section */}
      <div className="bg-gradient-to-r from-stone-100 via-kisan-50 to-stone-100 dark:from-stone-900 dark:via-kisan-950 dark:to-stone-900 border border-stone-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm dark:shadow-2xl transition-colors">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-kisan-600 dark:text-kisan-400" />
          <h3 className="font-display font-black text-2xl text-stone-900 dark:text-white">
            {t('for_farmers.rights_title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-white dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/5 space-y-1 transition-colors">
            <strong className="text-amber-700 dark:text-amber-400 block text-sm">
              {t('for_farmers.right1_title')}
            </strong>
            <span className="text-stone-600 dark:text-stone-400">
              {t('for_farmers.right1_desc')}
            </span>
          </div>
          <div className="bg-white dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/5 space-y-1 transition-colors">
            <strong className="text-kisan-700 dark:text-kisan-400 block text-sm">
              {t('for_farmers.right2_title')}
            </strong>
            <span className="text-stone-600 dark:text-stone-400">
              {t('for_farmers.right2_desc')}
            </span>
          </div>
          <div className="bg-white dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/5 space-y-1 transition-colors">
            <strong className="text-blue-700 dark:text-blue-400 block text-sm">
              {t('for_farmers.right3_title')}
            </strong>
            <span className="text-stone-600 dark:text-stone-400">
              {t('for_farmers.right3_desc')}
            </span>
          </div>
          <div className="bg-white dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/5 space-y-1 transition-colors">
            <strong className="text-purple-700 dark:text-purple-400 block text-sm">
              {t('for_farmers.right4_title')}
            </strong>
            <span className="text-stone-600 dark:text-stone-400">
              {t('for_farmers.right4_desc')}
            </span>
          </div>
          <div className="bg-white dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 dark:border-white/5 space-y-1 transition-colors">
            <strong className="text-emerald-700 dark:text-emerald-400 block text-sm">
              {t('for_farmers.right5_title')}
            </strong>
            <span className="text-stone-600 dark:text-stone-400">
              {t('for_farmers.right5_desc')}
            </span>
          </div>
          <div className="bg-kisan-100 dark:bg-gradient-to-br dark:from-kisan-900 dark:to-stone-950 p-4 rounded-2xl border border-kisan-200 dark:border-kisan-500/30 flex items-center justify-center text-center transition-colors">
            <Link to="/auth/farmer" className="text-kisan-800 dark:text-kisan-300 hover:text-kisan-900 dark:hover:text-white font-black text-sm">
              {t('for_farmers.right_link')}
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="text-center pt-2">
        <Link to="/auth/farmer">
          <Button variant="primary" size="lg" className="bg-kisan-600 hover:bg-kisan-500 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg">
            {t('for_farmers.cta_btn')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

