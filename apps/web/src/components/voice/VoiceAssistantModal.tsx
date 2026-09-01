import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CheckCircle2, AlertTriangle, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { ApiClient } from '../../services/api';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useNavigate } from 'react-router-dom';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { t, language, currentLanguageInfo, speak } = useI18n();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [interpretation, setInterpretation] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Web Speech API initialization
  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setInterpretation(null);
      setError(null);
      return;
    }

    // Auto-start listening when modal opens
    startListening();
  }, [isOpen]);

  const startListening = () => {
    setError(null);
    setInterpretation(null);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in browser, using fallback sample');
      simulateVoiceInput(t('voice_modal.sample_book'));
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguageInfo.speechCode || 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        processVoiceText(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        // If microphone access is blocked or fails, provide helpful pre-set sample inputs
        setError(t('voice_modal.sample_title'));
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setError(t('common.error'));
    }
  };

  const processVoiceText = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await ApiClient.parseVoiceIntent(text, language);
      if (res.data) {
        setInterpretation(res.data);
        // Audio read-aloud of AI confirmation prompt
        if (res.data.confirmationPrompt) {
          speak(res.data.confirmationPrompt);
        }
      }
    } catch (e) {
      setError(t('common.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateVoiceInput = (sampleText: string) => {
    setTranscript(sampleText);
    setIsListening(false);
    processVoiceText(sampleText);
  };

  const handleConfirmAction = () => {
    if (!interpretation) return;
    onClose();

    switch (interpretation.actionRecommendation) {
      case 'NAVIGATE_BOOKING':
        navigate('/farmer/book-slot');
        break;
      case 'NAVIGATE_TOKEN':
        navigate('/farmer/token');
        break;
      case 'NAVIGATE_QUEUE':
      case 'NAVIGATE_CENTERS':
        navigate('/farmer/centers');
        break;
      case 'NAVIGATE_PAYMENT':
        navigate('/farmer/track');
        break;
      default:
        navigate('/farmer');
        break;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('voice_modal.title')} maxWidth="md">
      <div className="space-y-5 text-center">
        {/* Visual Waveform / Mic Button */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative">
            <button
              onClick={isListening ? () => setIsListening(false) : startListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-100 dark:ring-red-950'
                  : 'bg-kisan-600 text-white hover:bg-kisan-700'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <Mic className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>
            {isListening && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                {t('voice_modal.listening')}
              </span>
            )}
          </div>

          <p className="text-sm font-bold text-stone-800 dark:text-stone-200 mt-4">
            {isListening
              ? t('voice_modal.speak_prompt', { lang: currentLanguageInfo.nativeName })
              : transcript
              ? t('voice_modal.you_said')
              : t('voice_modal.tap_to_speak')}
          </p>
        </div>

        {/* Spoken Transcript Bubble */}
        {transcript && (
          <div className="p-3.5 bg-stone-100 dark:bg-stone-950 rounded-xl text-left border border-stone-300 dark:border-stone-800">
            <div className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>{t('voice_modal.you_said')}</span>
            </div>
            <p className="text-stone-900 dark:text-white font-bold text-base">“{transcript}”</p>
          </div>
        )}

        {/* AI Intent Interpretation & Safety Confirmation */}
        {interpretation && (
          <div className="p-4 bg-kisan-50 dark:bg-kisan-950/80 rounded-2xl border-2 border-kisan-400 dark:border-kisan-700 text-left space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-0.5 rounded bg-kisan-200 dark:bg-kisan-900 text-kisan-950 dark:text-kisan-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-kisan-700 dark:text-kisan-400" />
                {t('voice_modal.intent_title')}
              </span>
              <span className="text-xs font-bold text-kisan-800 dark:text-kisan-300">
                {t('voice_modal.confidence')} {Math.round(interpretation.confidence * 100)}%
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-stone-900 dark:text-white">
                {interpretation.intent === 'BOOK_CROP' && `🌾 ${t('farmer.book_slot_title')}`}
                {interpretation.intent === 'CHECK_TOKEN' && `🎟️ ${t('farmer.my_token_title')}`}
                {interpretation.intent === 'CHECK_QUEUE' && `👥 ${t('center.active_queue')}`}
                {interpretation.intent === 'FIND_CENTER' && `📍 ${t('farmer.find_center_title')}`}
                {interpretation.intent === 'CHECK_PAYMENT' && `💳 ${t('nav.payments')}`}
                {interpretation.intent === 'HELP' && `ℹ️ ${t('brand.name')}`}
              </h4>
              <p className="text-xs font-medium text-stone-800 dark:text-stone-200">{interpretation.confirmationPrompt}</p>
            </div>

            {/* AI Safety Rule: Explicit Confirmation Buttons */}
            <div className="pt-2 border-t border-kisan-200 dark:border-kisan-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" className="font-bold" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="font-bold"
                onClick={handleConfirmAction}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t('voice_modal.confirm_btn')}
              </Button>
            </div>
          </div>
        )}

        {/* Quick Sample Chips for Easy Demo / Accessibility */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">{t('voice_modal.sample_title')}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => simulateVoiceInput(t('voice_modal.sample_book'))}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-kisan-100 dark:hover:bg-kisan-950 text-stone-900 dark:text-stone-100 hover:text-kisan-900 dark:hover:text-kisan-200 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
            >
              “{t('voice_modal.sample_book')}”
            </button>
            <button
              onClick={() => simulateVoiceInput(t('voice_modal.sample_token'))}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-kisan-100 dark:hover:bg-kisan-950 text-stone-900 dark:text-stone-100 hover:text-kisan-900 dark:hover:text-kisan-200 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
            >
              “{t('voice_modal.sample_token')}”
            </button>
            <button
              onClick={() => simulateVoiceInput(t('voice_modal.sample_queue'))}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-kisan-100 dark:hover:bg-kisan-950 text-stone-900 dark:text-stone-100 hover:text-kisan-900 dark:hover:text-kisan-200 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
            >
              “{t('voice_modal.sample_queue')}”
            </button>
            <button
              onClick={() => simulateVoiceInput(t('voice_modal.sample_payment'))}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 hover:bg-kisan-100 dark:hover:bg-kisan-950 text-stone-900 dark:text-stone-100 hover:text-kisan-900 dark:hover:text-kisan-200 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
            >
              “{t('voice_modal.sample_payment')}”
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
