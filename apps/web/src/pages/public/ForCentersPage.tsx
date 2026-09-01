import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Scale,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../i18n/i18nContext';

export const ForCentersPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-xs">
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('for_centers.badge')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
          {t('for_centers.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
          {t('for_centers.subtitle')}
        </p>
      </div>

      {/* 3 Core Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
            {t('for_centers.feat_pacing_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('for_centers.feat_pacing_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-kisan-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-black">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
            {t('for_centers.feat_weighing_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('for_centers.feat_weighing_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-purple-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-400 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
            {t('for_centers.feat_audit_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('for_centers.feat_audit_desc')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link to="/auth">
          <Button variant="primary" size="lg" className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-sm px-8 py-4 rounded-2xl shadow-lg">
            {t('for_centers.cta_btn')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

