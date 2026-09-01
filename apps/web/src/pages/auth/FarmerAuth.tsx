import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n/i18nContext';

export const FarmerAuth: React.FC = () => {
  const { sendOtp, verifyOtp } = useAuth();
  const { currentLanguageInfo, setLanguage, allLanguages, t } = useI18n();
  const navigate = useNavigate();

  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [mobile, setMobile] = useState('9876543210');
  const [name, setName] = useState('Ramesh Patel');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(mobile)) {
      setError(t('auth.error_invalid_mobile'));
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(mobile);
      if (res.demoOtp) {
        setDemoOtpHint(res.demoOtp);
        setOtp(res.demoOtp);
      }
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || t('auth.error_otp_send'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError(t('auth.error_invalid_otp'));
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({
        mobile,
        otp,
        name,
        preferredLanguage: currentLanguageInfo.code,
        state: 'Odisha',
        district: 'Balasore',
      });
      navigate('/farmer');
    } catch (err: any) {
      setError(err.message || t('auth.error_otp_verify'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-kisan-100 dark:bg-kisan-950 text-kisan-900 dark:text-kisan-200 flex items-center justify-center text-2xl font-black mx-auto shadow-inner border border-kisan-300 dark:border-kisan-700">
          🌾
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          {t('auth.farmer_login_title')}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
          {t('auth.farmer_login_tagline')}
        </p>
      </div>

      {/* Auth Card */}
      <Card variant="default" className="p-6 sm:p-8 space-y-5 shadow-lg">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-xs text-red-900 dark:text-red-200 font-bold">
            {error}
          </div>
        )}

        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('auth.preferred_language')}
              </label>
              <select
                value={currentLanguageInfo.code}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-3 bg-stone-50 dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-xs font-bold focus:border-kisan-600 focus:outline-none"
              >
                {allLanguages.map((l: any) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('auth.farmer_name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.farmer_name_placeholder')}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 rounded-xl text-sm font-semibold focus:border-kisan-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('auth.mobile_label')}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-stone-700 dark:text-stone-300 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 rounded-xl text-sm font-mono font-black tracking-wider focus:border-kisan-600 focus:outline-none"
                  required
                />
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 font-medium">
                {t('auth.demo_mobile_hint')} <span className="font-mono font-bold text-stone-900 dark:text-stone-200">9876543210</span> (Ramesh Patel)
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('auth.send_otp_btn')}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 bg-kisan-50 dark:bg-kisan-950/90 rounded-xl border border-kisan-300 dark:border-kisan-700 text-xs text-kisan-950 dark:text-kisan-200 space-y-1">
              <div className="flex justify-between items-center">
                <span>{t('auth.otp_sent_to')} <strong className="font-bold">+91-{mobile}</strong></span>
                <button
                  type="button"
                  onClick={() => setStep('MOBILE')}
                  className="text-kisan-800 dark:text-kisan-300 underline font-bold cursor-pointer"
                >
                  {t('auth.change')}
                </button>
              </div>
              {demoOtpHint && (
                <div className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                  {t('auth.verification_otp')} <strong className="font-mono text-kisan-900 dark:text-kisan-200 font-bold">{demoOtpHint}</strong>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('auth.otp_label')}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-3 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 text-center text-lg font-mono font-black tracking-widest focus:border-kisan-600 focus:outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold"
              isLoading={loading}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {t('auth.verify_otp_btn')}
            </Button>
          </form>
        )}

        <div className="border-t border-stone-200 dark:border-stone-800 pt-4 text-center text-xs">
          <Link to="/auth" className="text-kisan-700 dark:text-kisan-400 hover:underline font-bold">
            {t('auth.back_to_roles')}
          </Link>
        </div>
      </Card>
    </div>
  );
};
