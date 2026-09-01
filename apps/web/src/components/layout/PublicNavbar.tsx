import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, ShieldCheck, Sparkles, Menu, X, ArrowRight, Check, Search, ChevronDown, PhoneCall, Radio, Sun, Moon } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const PublicNavbar: React.FC = () => {
  const { currentLanguageInfo, setLanguage, allLanguages, t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const location = useLocation();

  const filteredLanguages = allLanguages.filter(
    (l: any) =>
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.script.toLowerCase().includes(langSearch.toLowerCase())
  );

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/how-it-works', label: t('nav.how_it_works') },
    { path: '/for-farmers', label: t('nav.for_farmers') },
    { path: '/for-centers', label: t('nav.for_centers') },
    { path: '/for-government', label: t('nav.for_government') },
  ];

  return (
    <>
      {/* Top Ticker / Notification Bar */}
      <div className="bg-gradient-to-r from-kisan-50 via-stone-100 to-kisan-50 dark:from-kisan-950 dark:via-stone-900 dark:to-kisan-950 border-b border-stone-200 dark:border-white/5 py-1 px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kisan-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-kisan-600 dark:bg-kisan-500"></span>
            </span>
            <span className="text-[11px] font-medium truncate">
              {t('nav.top_banner')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] shrink-0 font-medium">
            <a href="tel:18001801551" className="hover:text-amber-600 dark:hover:text-amber-300 text-stone-600 dark:text-stone-400 flex items-center gap-1 transition-colors">
              <PhoneCall className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">{t('nav.toll_free')}</span> 1800-180-1551
            </a>
            <span className="text-stone-300 dark:text-stone-700 hidden md:inline">•</span>
            <span className="text-stone-500 dark:text-stone-400 hidden md:inline">{t('nav.supported_languages')}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-950/90 backdrop-blur-xl border-b border-stone-200 dark:border-white/10 text-stone-900 dark:text-white shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* 1. Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group py-1">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-kisan-600 via-kisan-700 to-kisan-900 flex items-center justify-center text-white text-xl shadow-sm border border-kisan-400/30 group-hover:scale-105 transition-transform">
                🌾
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-stone-950"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-stone-900 dark:text-white group-hover:text-kisan-600 dark:group-hover:text-kisan-400 transition-colors whitespace-nowrap">
                {t('brand.name')}
              </span>
              <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 mt-0.5 hidden sm:inline whitespace-nowrap">
                “{t('brand.tagline')}”
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Center Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-stone-100/90 dark:bg-stone-900/90 p-1 rounded-full border border-stone-200 dark:border-white/10 shadow-inner shrink-0">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-kisan-600 text-white shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Action Controls (Theme, Language, Demo, Auth) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/90 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-white/10 transition-colors shrink-0"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="h-9 flex items-center gap-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/90 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-white/10 transition-colors shrink-0 whitespace-nowrap"
              title="Change Language (22 Indian Languages)"
            >
              <Globe className="w-3.5 h-3.5 text-kisan-600 dark:text-kisan-400" />
              <span>{currentLanguageInfo.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* Interactive Live Demo */}
            <Link
              to="/demo"
              className="h-9 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t('nav.live_demo')}</span>
            </Link>

            <div className="h-5 w-px bg-stone-200 dark:border-white/10 dark:bg-stone-800 my-auto mx-0.5" />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={
                    user?.role === 'FARMER'
                      ? '/farmer'
                      : user?.role === 'OFFICER'
                      ? '/officer'
                      : user?.role === 'AUDITOR'
                      ? '/auditor'
                      : '/admin'
                  }
                  className="h-9 px-3.5 rounded-xl bg-kisan-600 hover:bg-kisan-500 text-white text-xs font-bold shadow-xs flex items-center justify-center whitespace-nowrap"
                >
                  {t('nav.dashboard')} ({user?.name.split(' ')[0]})
                </Link>
                <button
                  onClick={logout}
                  className="h-9 px-2 text-stone-500 hover:text-red-600 text-xs transition-colors whitespace-nowrap"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to="/auth/farmer"
                  className="h-9 px-3.5 rounded-xl bg-kisan-600 hover:bg-kisan-500 text-white text-xs font-bold shadow-xs flex items-center justify-center transition-colors whitespace-nowrap border border-kisan-400/30"
                >
                  {t('nav.farmer_login')}
                </Link>
                <Link
                  to="/auth"
                  className="h-9 px-3 rounded-xl bg-transparent hover:bg-stone-100 dark:hover:bg-white/5 text-stone-700 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-white/10 flex items-center justify-center transition-colors whitespace-nowrap"
                >
                  {t('nav.officer_login')}
                </Link>
              </div>
            )}
          </div>

          {/* 4. Mobile & Tablet Menu Trigger Controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-700" />}
            </button>

            {/* Mobile Language Trigger */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="h-8 px-2 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-kisan-600 dark:text-kisan-400" />
              <span>{currentLanguageInfo.code.toUpperCase()}</span>
            </button>

            {/* Mobile Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 dark:bg-stone-950/98 border-b border-stone-200 dark:border-white/10 px-4 py-4 space-y-3 backdrop-blur-2xl animate-fadeIn shadow-lg">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-kisan-50 dark:bg-kisan-900/60 text-kisan-800 dark:text-kisan-300 font-bold border border-kisan-200 dark:border-kisan-700/50'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex flex-col gap-2">
              <Link
                to="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>✨ {t('nav.live_demo')} (Demo Mode)</span>
              </Link>
              <Link
                to="/auth/farmer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-kisan-600 hover:bg-kisan-500 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                🌾 {t('nav.farmer_login')} (Farmer Portal)
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold"
              >
                🏛️ {t('nav.officer_login')} (Staff Portal)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 22 Indian Languages Selection Modal with Search & Rich Cards */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/15 rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col transition-colors">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-kisan-50 dark:bg-kisan-950 border border-kisan-200 dark:border-kisan-500/40 text-kisan-700 dark:text-kisan-400 text-xs font-bold mb-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>22 Constitutional Languages (8th Schedule)</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-stone-900 dark:text-white">
                  {t('common.select_lang_title')}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {t('common.select_lang_desc')}
                </p>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search language (e.g. English, Hindi, Bengali, Tamil, Odia)..."
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden focus:border-kisan-500 transition-colors"
              />
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 overflow-y-auto pr-1 flex-1 py-2">
              {filteredLanguages.map((lang: any) => {
                const isSelected = currentLanguageInfo.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangModalOpen(false);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'border-kisan-500 bg-kisan-50 dark:bg-kisan-950/80 text-stone-900 dark:text-white shadow-md ring-2 ring-kisan-500/30'
                        : 'border-stone-200 dark:border-white/5 hover:border-stone-400 dark:hover:border-white/20 bg-stone-50/50 dark:bg-stone-950/50 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-display font-bold text-sm text-stone-900 dark:text-white group-hover:text-kisan-600 dark:group-hover:text-kisan-300 transition-colors">
                        {lang.nativeName}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-kisan-600 dark:text-kisan-400" />}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span>{lang.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-200/80 dark:bg-stone-900 border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400 uppercase">
                        {lang.code}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>Selected: <strong className="text-kisan-700 dark:text-kisan-400 font-bold">{currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</strong></span>
              <button
                onClick={() => setLangModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
