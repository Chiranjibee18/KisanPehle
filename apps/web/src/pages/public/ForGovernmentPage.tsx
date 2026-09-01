import React from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  ShieldAlert,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../i18n/i18nContext';

export const ForGovernmentPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/40 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-xs">
          <Landmark className="w-3.5 h-3.5" />
          <span>{t('for_government.badge')}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
          {t('for_government.title')}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
          {t('for_government.subtitle')}
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-black">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
            {t('for_government.feat_dashboard_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('for_government.feat_dashboard_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-red-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-400 flex items-center justify-center font-black">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
            {t('for_government.feat_alerts_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('for_government.feat_alerts_desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-sm dark:shadow-xl hover:border-kisan-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 flex items-center justify-center font-black">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-stone-900 dark:text-white">
            {t('for_government.feat_reports_title')}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {t('for_government.feat_reports_desc')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link to="/auth">
          <Button variant="primary" size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg">
            {t('for_government.cta_btn')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

