import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, MessageSquare, Send, Volume2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useI18n } from '../../i18n/i18nContext';
import { ApiClient } from '../../services/api';

export const IvrSimulator: React.FC = () => {
  const { t, speak } = useI18n();

  // Virtual Phone State
  const [callerNumber, setCallerNumber] = useState('9876543210');
  const [callActive, setCallActive] = useState(false);
  const [ivrStep, setIvrStep] = useState('LANGUAGE');
  const [ivrText, setIvrText] = useState('');
  const [ivrOptions, setIvrOptions] = useState<any[]>([]);
  const [callHistory, setCallHistory] = useState<string[]>([]);
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSmsLogs();
  }, []);

  const fetchSmsLogs = async () => {
    try {
      const res = await ApiClient.getSmsLogs();
      if (res.data) setSmsLogs(res.data);
    } catch (e) {}
  };

  const startCall = async () => {
    setCallActive(true);
    setLoading(true);
    try {
      const res = await ApiClient.simulateIvr({
        callerNumber,
        step: 'LANGUAGE',
      });
      if (res.data) {
        setIvrStep(res.data.step);
        setIvrText(res.data.responseText);
        setIvrOptions(res.data.options || []);
        setCallHistory([`[Call Started] ${res.data.responseText}`]);
        speak(res.data.responseText, 'hi');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDialDigit = async (digit: string) => {
    if (!callActive) return;
    setLoading(true);
    try {
      const res = await ApiClient.simulateIvr({
        callerNumber,
        step: ivrStep,
        dtmfDigit: digit,
      });
      if (res.data) {
        setIvrStep(res.data.step);
        setIvrText(res.data.responseText);
        setIvrOptions(res.data.options || []);
        setCallHistory((prev) => [...prev, `[Keypad: ${digit}]`, res.data.responseText]);
        speak(res.data.responseText, res.data.language || 'hi');

        if (res.data.isEnded) {
          setTimeout(() => {
            setCallActive(false);
          }, 4000);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const endCall = () => {
    setCallActive(false);
    setIvrText('Call Ended');
    setIvrOptions([]);
    setCallHistory((prev) => [...prev, '[Call Ended]']);
  };

  const dialpadButtons = [
    { digit: '1', sub: ' ' },
    { digit: '2', sub: 'ABC' },
    { digit: '3', sub: 'DEF' },
    { digit: '4', sub: 'GHI' },
    { digit: '5', sub: 'JKL' },
    { digit: '6', sub: 'MNO' },
    { digit: '7', sub: 'PQRS' },
    { digit: '8', sub: 'TUV' },
    { digit: '9', sub: 'WXYZ' },
    { digit: '*', sub: '' },
    { digit: '0', sub: '+' },
    { digit: '#', sub: '' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
          <span>☎️</span>
          <span>{t('ivr.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
          {t('ivr.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Virtual Feature Phone UI (Keypad IVR) */}
        <div className="md:col-span-6 flex justify-center">
          <div className="w-full max-w-sm bg-stone-900 rounded-[38px] p-5 shadow-2xl border-4 border-stone-700 text-white space-y-4">
            {/* Phone Speaker & Brand */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-1.5 bg-stone-700 rounded-full" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
                {t('brand.name')} IVR 1800-XXX-XXXX
              </span>
            </div>

            {/* Virtual LCD Screen */}
            <div className="bg-emerald-950 border-2 border-emerald-800 rounded-2xl p-4 min-h-[170px] flex flex-col justify-between shadow-inner text-emerald-200 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-emerald-300 border-b border-emerald-900 pb-1">
                <span>SIM 1 • VoLTE</span>
                <span>{callActive ? '00:32 (In Call)' : 'Ready'}</span>
              </div>

              <div className="py-2 text-xs space-y-1">
                {callActive ? (
                  <>
                    <p className="font-bold text-white leading-relaxed">
                      {ivrText || t('ivr.connecting')}
                    </p>
                    {ivrOptions.length > 0 && (
                      <div className="pt-1 text-[11px] text-emerald-200 space-y-0.5">
                        {ivrOptions.map((o) => (
                          <div key={o.digit} className="font-bold">
                            {o.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 text-emerald-300">
                    <p className="font-bold">{t('ivr.press_green')}</p>
                    <p className="text-[10px] text-emerald-400 mt-1">{t('ivr.mobile_label')} {callerNumber}</p>
                  </div>
                )}
              </div>

              <div className="text-[9px] text-emerald-400 text-right">
                {t('brand.tagline')}
              </div>
            </div>

            {/* Call Action Bar */}
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={callActive}
                onClick={startCall}
                className="py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-40 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('ivr.call_action')}</span>
              </button>

              <button
                disabled={!callActive}
                onClick={endCall}
                className="py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-40 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{t('ivr.end_action')}</span>
              </button>
            </div>

            {/* Keypad Grid (DTMF) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {dialpadButtons.map((btn) => (
                <button
                  key={btn.digit}
                  onClick={() => handleDialDigit(btn.digit)}
                  className="py-3 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 rounded-xl flex flex-col items-center justify-center transition-all border border-stone-700/60 shadow-xs cursor-pointer"
                >
                  <span className="text-lg font-black text-white font-mono leading-none">
                    {btn.digit}
                  </span>
                  {btn.sub && (
                    <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-0.5">
                      {btn.sub}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SMS Dispatch Log & Call Transcript Panel */}
        <div className="md:col-span-6 space-y-6">
          {/* SMS Dispatch Inbox */}
          <Card variant="default" className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-kisan-600 dark:text-kisan-400" />
                <h3 className="font-black text-sm text-stone-900 dark:text-white">
                  {t('ivr.sms_title')}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchSmsLogs}>
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {smsLogs.length === 0 ? (
                <p className="text-xs text-stone-500 dark:text-stone-400 text-center py-6 font-medium">{t('ivr.no_sms')}</p>
              ) : (
                smsLogs.map((sms) => (
                  <div key={sms.id} className="p-3 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-stone-900 dark:text-white">{sms.title}</span>
                      <span className="text-stone-500 dark:text-stone-400 font-mono text-[10px] font-semibold">
                        {new Date(sms.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 font-medium">{sms.message}</p>
                    <div className="text-[10px] text-green-700 dark:text-green-400 font-bold pt-0.5">
                      ✓ Sent to {sms.user?.mobile || '9876543210'} via Telecom CPaaS Gateway
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Interactive Call Transcript Stream */}
          <Card variant="default" className="p-5 space-y-3">
            <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{t('ivr.transcript_title')}</span>
            </h3>

            <div className="bg-stone-100 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 max-h-48 overflow-y-auto font-mono text-xs space-y-1.5">
              {callHistory.length === 0 ? (
                <p className="text-stone-500 dark:text-stone-400 italic">{t('ivr.no_history')}</p>
              ) : (
                callHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={item.startsWith('[Keypad') ? 'text-amber-800 dark:text-amber-300 font-black' : 'text-stone-900 dark:text-stone-100 font-medium'}
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
