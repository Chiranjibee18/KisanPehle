import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_22_INDIAN_LANGUAGES, LanguageInfo } from './languages';
import { TranslationKey, getTranslation, RTL_LOCALES } from './translations';

// =====================================================================
// Kisan Pehele — i18n Context (Single Source of Truth)
// Language selection order:
//   1. User's explicit localStorage selection (highest priority)
//   2. Browser language mapped to a supported Indian language
//   3. English (safe default)
// =====================================================================

const PRIMARY_STORAGE_KEY = 'kisan_pehele_lang';
const LEGACY_STORAGE_KEY = 'kisanPehele.locale';

function detectBrowserLocale(): string {
  if (typeof navigator === 'undefined') return 'en';
  const supported = ALL_22_INDIAN_LANGUAGES.map((l) => l.code);
  const navLangs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];

  for (const lang of navLangs) {
    if (!lang) continue;
    // Normalize e.g. "hi-IN" -> "hi", "or-IN" -> "or", "en-US" -> "en"
    const code = lang.split('-')[0].toLowerCase().trim();
    if (supported.includes(code)) {
      return code;
    }
  }
  return 'en';
}

function resolveInitialLocale(): string {
  const supported = ALL_22_INDIAN_LANGUAGES.map((l) => l.code);
  
  // 1. Explicit primary key
  const stored = localStorage.getItem(PRIMARY_STORAGE_KEY);
  if (stored && supported.includes(stored)) return stored;

  // 2. Legacy key compatibility
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy && supported.includes(legacy)) {
    localStorage.setItem(PRIMARY_STORAGE_KEY, legacy);
    return legacy;
  }

  // 3. Browser language or fallback to English
  return detectBrowserLocale();
}

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  speak: (text: string, langOverride?: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  allLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(resolveInitialLocale);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLanguageInfo =
    ALL_22_INDIAN_LANGUAGES.find((l) => l.code === language) ||
    ALL_22_INDIAN_LANGUAGES.find((l) => l.code === 'en')!;

  const isRTL = RTL_LOCALES.includes(language);

  // Keep <html lang> and <html dir> in sync with the active locale
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const setLanguage = (lang: string) => {
    const supported = ALL_22_INDIAN_LANGUAGES.map((l) => l.code);
    if (!supported.includes(lang)) {
      console.warn(`[i18n] Unsupported locale: ${lang}. Falling back to 'en'.`);
      lang = 'en';
    }
    setLanguageState(lang);
    localStorage.setItem(PRIMARY_STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_STORAGE_KEY, lang);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string, langOverride?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetCode = langOverride || language;
    const targetInfo = ALL_22_INDIAN_LANGUAGES.find((l) => l.code === targetCode);
    utterance.lang = targetInfo?.speechCode || 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        isSpeaking,
        stopSpeaking,
        allLanguages: ALL_22_INDIAN_LANGUAGES,
        currentLanguageInfo,
        isRTL,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
