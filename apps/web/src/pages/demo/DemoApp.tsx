import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { FarmerHome } from '../farmer/FarmerHome';
import { CenterDiscovery } from '../farmer/CenterDiscovery';
import { SlotBooking } from '../farmer/SlotBooking';
import { TokenView } from '../farmer/TokenView';
import { ProcurementTracker } from '../farmer/ProcurementTracker';
import { TrustedHelperPage } from '../farmer/TrustedHelperPage';
import { OfficerConsole } from '../officer/OfficerConsole';
import { AdminDashboard } from '../admin/AdminDashboard';
import { AuditorPortal } from '../auditor/AuditorPortal';
import { IvrSimulator } from '../simulator/IvrSimulator';
import { useI18n } from '../../i18n/i18nContext';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const DemoApp: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentRole = () => {
    if (location.pathname.includes('/officer')) return 'OFFICER';
    if (location.pathname.includes('/admin')) return 'DISTRICT_ADMIN';
    if (location.pathname.includes('/auditor')) return 'AUDITOR';
    if (location.pathname.includes('/simulator')) return 'SIMULATOR';
    return 'FARMER';
  };

  const handleRoleChange = (role: string) => {
    switch (role) {
      case 'OFFICER':
        navigate('/demo/officer');
        break;
      case 'DISTRICT_ADMIN':
        navigate('/demo/admin');
        break;
      case 'AUDITOR':
        navigate('/demo/auditor');
        break;
      case 'SIMULATOR':
        navigate('/demo/simulator');
        break;
      case 'FARMER':
      default:
        navigate('/demo/farmer');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Demo Notice Banner */}
      <div className="bg-amber-500 text-stone-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>
            {t('demo.frozen_banner')}
          </span>
        </div>
        <Link
          to="/"
          className="text-stone-950 underline hover:no-underline font-extrabold text-[11px] whitespace-nowrap ml-4 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('demo.public_portal')}</span>
        </Link>
      </div>

      {/* Demo Header with Role Switcher */}
      <Header currentRole={getCurrentRole()} onRoleChange={handleRoleChange} />

      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="farmer" replace />} />
          <Route path="farmer" element={<FarmerHome />} />
          <Route path="farmer/centers" element={<CenterDiscovery />} />
          <Route path="farmer/book-slot" element={<SlotBooking />} />
          <Route path="farmer/token" element={<TokenView />} />
          <Route path="farmer/track" element={<ProcurementTracker />} />
          <Route path="farmer/helpers" element={<TrustedHelperPage />} />
          <Route path="officer" element={<OfficerConsole />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="auditor" element={<AuditorPortal />} />
          <Route path="simulator" element={<IvrSimulator />} />
          <Route path="*" element={<Navigate to="farmer" replace />} />
        </Routes>
      </main>

      <footer className="bg-stone-900 text-stone-400 text-xs py-4 border-t border-stone-800 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌾 {t('brand.name')} — SIH26032 {t('demo.footer_tag')}</span>
          <span className="text-[11px] text-stone-500">“{t('brand.tagline')}” • Demo Environment</span>
        </div>
      </footer>
    </div>
  );
};
