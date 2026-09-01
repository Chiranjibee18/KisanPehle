import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Bell, Radio, ChevronDown, LogOut, Sun, Moon } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Modal } from '../ui/Modal';
import { ApiClient } from '../../services/api';

interface HeaderProps {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const { language, setLanguage, allLanguages, currentLanguageInfo, t } = useI18n();
  const { user, demoLogin, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch initial notifications
    ApiClient.getNotifications()
      .then((res) => {
        if (res.data) setNotifications(res.data);
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const roles = [
    { key: 'FARMER', label: t('header.role_farmer'), path: '/farmer' },
    { key: 'OFFICER', label: t('header.role_officer'), path: '/officer' },
    { key: 'DISTRICT_ADMIN', label: t('header.role_admin'), path: '/admin' },
    { key: 'AUDITOR', label: t('header.role_auditor'), path: '/auditor' },
    { key: 'SIMULATOR', label: t('header.role_simulator'), path: '/simulator' },
  ];

  // Derive active role accurately from current route
  const activeRole = location.pathname.startsWith('/admin')
    ? 'DISTRICT_ADMIN'
    : location.pathname.startsWith('/officer')
    ? 'OFFICER'
    : location.pathname.startsWith('/auditor')
    ? 'AUDITOR'
    : location.pathname.startsWith('/simulator')
    ? 'SIMULATOR'
    : location.pathname.startsWith('/farmer')
    ? 'FARMER'
    : currentRole || user?.role || 'FARMER';

  const handleRoleSelect = async (targetRole: string) => {
    if (onRoleChange) {
      onRoleChange(targetRole);
    }
    const target = roles.find((r) => r.key === targetRole);
    if (!target) return;

    if (targetRole === 'SIMULATOR') {
      navigate('/simulator');
      return;
    }

    try {
      await demoLogin(targetRole);
    } catch (e) {
      console.warn('[Header] Session switch:', e);
    }
    navigate(target.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
      {/* Top Notification / Offline Bar if offline */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>{t('header.offline_banner')}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <Link to="/farmer" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-kisan-600 text-white flex items-center justify-center text-2xl shadow-sm group-hover:bg-kisan-700 transition-colors">
            🌾
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-stone-900 dark:text-white block">
              {t('brand.name')}
            </span>
            <p className="text-xs font-bold text-kisan-700 dark:text-kisan-400">
              “{t('brand.tagline')}”
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isOnline ? t('header.live_sync') : t('header.offline_cache')}</span>
          </div>

          {/* Language Selector Trigger */}
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold transition-colors focus:ring-2 focus:ring-kisan-500 cursor-pointer"
            aria-label="Change language"
          >
            <Globe className="w-4 h-4 text-kisan-700 dark:text-kisan-400" />
            <span className="hidden sm:inline">{currentLanguageInfo.nativeName}</span>
            <span className="sm:hidden">{currentLanguageInfo.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-stone-500 dark:text-stone-400" />
          </button>

          {/* Role Switcher for Production & Demo Evaluation */}
          <div className="relative">
            <select
              value={activeRole}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-lg border-2 border-kisan-600 bg-kisan-50 dark:bg-stone-800 text-kisan-950 dark:text-kisan-100 hover:bg-kisan-100 dark:hover:bg-stone-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-kisan-500 appearance-none pr-8"
              aria-label="Switch portal role"
            >
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-kisan-700 dark:text-kisan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:ring-2 focus:ring-kisan-500 cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-stone-700" />
            )}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:ring-2 focus:ring-kisan-500 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white ring-1 ring-amber-400" />
            )}
          </button>

          {/* Logout Action Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold transition-colors focus:ring-2 focus:ring-red-500 cursor-pointer shadow-2xs"
            title={t('nav.logout')}
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="hidden sm:inline">{t('nav.logout')}</span>
          </button>
        </div>
      </div>

      {/* Language Selection Modal (22 Languages Architecture) */}
      <Modal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        title={t('header.lang_modal_title')}
        maxWidth="lg"
      >
        <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mb-4">
          {t('header.lang_modal_desc')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {allLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsLangModalOpen(false);
              }}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                language === lang.code
                  ? 'border-kisan-600 bg-kisan-50/90 dark:bg-kisan-950/90 shadow-xs'
                  : 'border-stone-200 dark:border-stone-700 hover:border-kisan-400 dark:hover:border-kisan-500 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <div className="font-bold text-sm text-stone-900 dark:text-stone-100">{lang.nativeName}</div>
              <div className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-0.5">{lang.name} ({lang.script})</div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Notifications Drawer Modal */}
      <Modal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        title={t('header.notif_modal_title')}
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-stone-500 dark:text-stone-400 text-sm font-medium">
              {t('header.notif_empty')}
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-white">{n.title}</span>
                  <span className="text-stone-500 dark:text-stone-400 font-mono text-[10px]">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-stone-800 dark:text-stone-200">{n.message}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 font-mono font-bold">
                    {n.channel}
                  </span>
                  <span className="text-[10px] text-green-700 dark:text-green-400 font-bold">{t('header.notif_delivered')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </header>
  );
};
