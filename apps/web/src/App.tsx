import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n/i18nContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PublicNavbar } from './components/layout/PublicNavbar';
import { RequireAuth } from './components/layout/RequireAuth';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ForFarmersPage } from './pages/public/ForFarmersPage';
import { ForCentersPage } from './pages/public/ForCentersPage';
import { ForGovernmentPage } from './pages/public/ForGovernmentPage';

// Auth Pages
import { AuthAccess } from './pages/auth/AuthAccess';
import { FarmerAuth } from './pages/auth/FarmerAuth';
import { OfficerAuth } from './pages/auth/OfficerAuth';
import { AdminAuth } from './pages/auth/AdminAuth';
import { AuditorAuth } from './pages/auth/AuditorAuth';

// Authenticated Application Pages
import { FarmerHome } from './pages/farmer/FarmerHome';
import { CenterDiscovery } from './pages/farmer/CenterDiscovery';
import { SlotBooking } from './pages/farmer/SlotBooking';
import { TokenView } from './pages/farmer/TokenView';
import { ProcurementTracker } from './pages/farmer/ProcurementTracker';
import { TrustedHelperPage } from './pages/farmer/TrustedHelperPage';
import { OfficerConsole } from './pages/officer/OfficerConsole';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AuditorPortal } from './pages/auditor/AuditorPortal';
import { IvrSimulator } from './pages/simulator/IvrSimulator';

// Frozen Demo Wrapper
import { DemoApp } from './pages/demo/DemoApp';
import { Header } from './components/layout/Header';

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-kisan-500 selection:text-white transition-colors duration-200">
      <PublicNavbar />
      <main className="flex-1 pb-16">{children}</main>
      <footer className="bg-stone-100 dark:bg-stone-950 text-stone-600 dark:text-stone-400 text-xs py-12 border-t border-stone-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-kisan-600 flex items-center justify-center text-white text-base font-black shadow-sm">
                  🌾
                </div>
                <span className="font-display font-black text-stone-900 dark:text-white text-base">
                  {t('brand.name')}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                {t('footer.desc')}
              </p>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                {t('footer.compliance')}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-display font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider block">
                {t('footer.nav_title')}
              </span>
              <ul className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                <li><Link to="/" className="hover:text-kisan-600 dark:hover:text-white transition-colors">{t('footer.link_home')}</Link></li>
                <li><Link to="/how-it-works" className="hover:text-kisan-600 dark:hover:text-white transition-colors">{t('footer.link_how')}</Link></li>
                <li><Link to="/for-farmers" className="hover:text-kisan-600 dark:hover:text-white transition-colors">{t('footer.link_farmers')}</Link></li>
                <li><Link to="/for-centers" className="hover:text-kisan-600 dark:hover:text-white transition-colors">{t('footer.link_centers')}</Link></li>
                <li><Link to="/for-government" className="hover:text-kisan-600 dark:hover:text-white transition-colors">{t('footer.link_govt')}</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-display font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider block">
                {t('footer.portals_title')}
              </span>
              <ul className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                <li><Link to="/auth/farmer" className="hover:text-kisan-700 text-kisan-600 dark:text-kisan-400 font-semibold transition-colors">{t('footer.link_farmer_login')}</Link></li>
                <li><Link to="/auth/officer" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('footer.link_officer')}</Link></li>
                <li><Link to="/auth/admin" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('footer.link_admin')}</Link></li>
                <li><Link to="/auth/auditor" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('footer.link_auditor')}</Link></li>
                <li><Link to="/demo" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">{t('footer.link_demo')}</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-display font-bold text-stone-900 dark:text-white text-xs uppercase tracking-wider block">
                {t('footer.helpline_title')}
              </span>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-white/10 space-y-1 shadow-xs">
                <div className="font-display font-black text-amber-600 dark:text-amber-400 text-sm">
                  1800-180-1551
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-400">
                  {t('footer.helpline_desc')}
                </div>
              </div>
              <div className="text-[10px] text-stone-500">
                {t('footer.ministry')}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 text-center sm:text-left">
            <div>{t('footer.copyright')}</div>
            <div className="flex items-center gap-4">
              <span>{t('footer.public_service')}</span>
              <span>•</span>
              <span>{t('footer.pfms_dbt')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Authenticated Product Portal Layout
const AuthenticatedProductLayout: React.FC<{ children: React.ReactNode; currentRole: string }> = ({
  children,
  currentRole,
}) => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      <Header currentRole={currentRole} />
      <main className="flex-1 pb-16">{children}</main>
      <footer className="bg-stone-900 text-stone-400 text-xs py-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-white font-bold block text-sm">{t('brand.name')}</span>
            <span>“{t('brand.tagline')}”</span>
          </div>
          <div className="text-[11px] text-stone-500">
            {t('footer.copyright')} • {t('footer.public_service')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Frozen Demo Routes (Preserved Exactly as Built) */}
              <Route path="/demo/*" element={<DemoApp />} />

              {/* Public Product Pages */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <LandingPage />
                  </PublicLayout>
                }
              />
            <Route
              path="/how-it-works"
              element={
                <PublicLayout>
                  <HowItWorksPage />
                </PublicLayout>
              }
            />
            <Route
              path="/for-farmers"
              element={
                <PublicLayout>
                  <ForFarmersPage />
                </PublicLayout>
              }
            />
            <Route
              path="/for-centers"
              element={
                <PublicLayout>
                  <ForCentersPage />
                </PublicLayout>
              }
            />
            <Route
              path="/for-government"
              element={
                <PublicLayout>
                  <ForGovernmentPage />
                </PublicLayout>
              }
            />

            {/* Authentication Routes */}
            <Route
              path="/auth"
              element={
                <PublicLayout>
                  <AuthAccess />
                </PublicLayout>
              }
            />
            <Route
              path="/auth/farmer"
              element={
                <PublicLayout>
                  <FarmerAuth />
                </PublicLayout>
              }
            />
            <Route
              path="/auth/officer"
              element={
                <PublicLayout>
                  <OfficerAuth />
                </PublicLayout>
              }
            />
            <Route
              path="/auth/admin"
              element={
                <PublicLayout>
                  <AdminAuth />
                </PublicLayout>
              }
            />
            <Route
              path="/auth/auditor"
              element={
                <PublicLayout>
                  <AuditorAuth />
                </PublicLayout>
              }
            />

            {/* Protected Farmer Application */}
            <Route
              path="/farmer"
              element={
                <RequireAuth allowedRoles={['FARMER', 'TRUSTED_HELPER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="FARMER">
                    <FarmerHome />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/farmer/centers"
              element={
                <RequireAuth allowedRoles={['FARMER', 'TRUSTED_HELPER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="FARMER">
                    <CenterDiscovery />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/farmer/book-slot"
              element={
                <RequireAuth allowedRoles={['FARMER', 'TRUSTED_HELPER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="FARMER">
                    <SlotBooking />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/farmer/token"
              element={
                <RequireAuth allowedRoles={['FARMER', 'TRUSTED_HELPER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="FARMER">
                    <TokenView />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/farmer/track"
              element={
                <RequireAuth allowedRoles={['FARMER', 'TRUSTED_HELPER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="FARMER">
                    <ProcurementTracker />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/farmer/helpers"
              element={
                <RequireAuth allowedRoles={['FARMER', 'TRUSTED_HELPER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="FARMER">
                    <TrustedHelperPage />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />

            {/* Protected Officer Console */}
            <Route
              path="/officer"
              element={
                <RequireAuth allowedRoles={['OFFICER', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="OFFICER">
                    <OfficerConsole />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />

            {/* Protected Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <RequireAuth allowedRoles={['DISTRICT_ADMIN', 'STATE_ADMIN', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="DISTRICT_ADMIN">
                    <AdminDashboard />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />

            {/* Protected Auditor Portal */}
            <Route
              path="/auditor"
              element={
                <RequireAuth allowedRoles={['AUDITOR', 'SUPER_ADMIN']}>
                  <AuthenticatedProductLayout currentRole="AUDITOR">
                    <AuditorPortal />
                  </AuthenticatedProductLayout>
                </RequireAuth>
              }
            />

            {/* Public Simulator */}
            <Route
              path="/simulator"
              element={
                <PublicLayout>
                  <IvrSimulator />
                </PublicLayout>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  </ThemeProvider>
  );
};
export default App;
