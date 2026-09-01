import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n/i18nContext';

export const AuthAccess: React.FC = () => {
  const { demoLogin } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleQuickDemo = async (role: string, targetPath: string) => {
    try {
      await demoLogin(role);
      navigate(targetPath);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kisan-100 dark:bg-kisan-950 text-kisan-900 dark:text-kisan-200 border border-kisan-300 dark:border-kisan-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-kisan-700 dark:text-kisan-400" />
          <span>{t('auth.access_badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
          {t('auth.access_title')}
        </h1>
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 max-w-xl mx-auto">
          {t('auth.access_subtitle')}
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Farmer Card */}
        <Card variant="default" className="p-6 space-y-4 hover:border-kisan-600 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-kisan-100 dark:bg-kisan-950 text-kisan-900 dark:text-kisan-200 border border-kisan-300 dark:border-kisan-700 flex items-center justify-center text-xl font-bold">
              🌾
            </div>
            <Badge variant="success">{t('auth.farmer_card_badge')}</Badge>
          </div>
          <div>
            <h3 className="font-black text-base text-stone-900 dark:text-white">{t('auth.farmer_card_title')}</h3>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
              {t('auth.farmer_card_desc')}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/auth/farmer">
              <Button variant="primary" size="md" className="w-full justify-between font-bold">
                <span>{t('auth.farmer_card_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={() => handleQuickDemo('FARMER', '/farmer')}
              className="text-xs text-stone-600 dark:text-stone-400 hover:text-kisan-700 dark:hover:text-kisan-300 font-bold text-center py-1 cursor-pointer"
            >
              {t('auth.farmer_card_demo')}
            </button>
          </div>
        </Card>

        {/* 2. Procurement Officer Card */}
        <Card variant="default" className="p-6 space-y-4 hover:border-amber-600 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-xl font-bold">
              📋
            </div>
            <Badge variant="warning">{t('auth.officer_card_badge')}</Badge>
          </div>
          <div>
            <h3 className="font-black text-base text-stone-900 dark:text-white">{t('auth.officer_card_title')}</h3>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
              {t('auth.officer_card_desc')}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/auth/officer">
              <Button variant="outline" size="md" className="w-full justify-between border-stone-300 dark:border-stone-700 font-bold">
                <span>{t('auth.officer_card_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={() => handleQuickDemo('OFFICER', '/officer')}
              className="text-xs text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold text-center py-1 cursor-pointer"
            >
              {t('auth.officer_card_demo')}
            </button>
          </div>
        </Card>

        {/* 3. District / State Admin Card */}
        <Card variant="default" className="p-6 space-y-4 hover:border-blue-600 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-xl font-bold">
              🏛️
            </div>
            <Badge variant="info">{t('auth.admin_card_badge')}</Badge>
          </div>
          <div>
            <h3 className="font-black text-base text-stone-900 dark:text-white">{t('auth.admin_card_title')}</h3>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
              {t('auth.admin_card_desc')}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/auth/admin">
              <Button variant="outline" size="md" className="w-full justify-between border-stone-300 dark:border-stone-700 font-bold">
                <span>{t('auth.admin_card_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={() => handleQuickDemo('DISTRICT_ADMIN', '/admin')}
              className="text-xs text-stone-600 dark:text-stone-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-center py-1 cursor-pointer"
            >
              {t('auth.admin_card_demo')}
            </button>
          </div>
        </Card>

        {/* 4. Auditor Card */}
        <Card variant="default" className="p-6 space-y-4 hover:border-purple-600 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700 flex items-center justify-center text-xl font-bold">
              🔍
            </div>
            <Badge variant="neutral">{t('auth.auditor_card_badge')}</Badge>
          </div>
          <div>
            <h3 className="font-black text-base text-stone-900 dark:text-white">{t('auth.auditor_card_title')}</h3>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
              {t('auth.auditor_card_desc')}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/auth/auditor">
              <Button variant="outline" size="md" className="w-full justify-between border-stone-300 dark:border-stone-700 font-bold">
                <span>{t('auth.auditor_card_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button
              onClick={() => handleQuickDemo('AUDITOR', '/auditor')}
              className="text-xs text-stone-600 dark:text-stone-400 hover:text-purple-800 dark:hover:text-purple-300 font-bold text-center py-1 cursor-pointer"
            >
              {t('auth.auditor_card_demo')}
            </button>
          </div>
        </Card>
      </div>

      {/* Presentation Demo Banner */}
      <div className="bg-stone-900 text-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-stone-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">{t('auth.demo_banner_title')}</h4>
            <p className="text-[11px] font-medium text-stone-300">
              {t('auth.demo_banner_desc')}
            </p>
          </div>
        </div>
        <Link to="/demo">
          <Button variant="secondary" size="sm" className="bg-amber-400 text-stone-950 font-bold whitespace-nowrap">
            {t('auth.demo_banner_btn')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
