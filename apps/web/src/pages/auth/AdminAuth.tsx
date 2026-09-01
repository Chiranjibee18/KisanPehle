import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n/i18nContext';

export const AdminAuth: React.FC = () => {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('9876543240');
  const [password, setPassword] = useState('kisan123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(mobile, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || t('auth.admin_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 flex items-center justify-center text-2xl font-black mx-auto shadow-inner border border-blue-300 dark:border-blue-700">
          🏛️
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
          {t('auth.admin_login_title')}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
          {t('auth.admin_login_desc')}
        </p>
      </div>

      <Card variant="default" className="p-6 sm:p-8 space-y-5 shadow-lg">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-xs text-red-900 dark:text-red-200 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              {t('auth.admin_id_label')}
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 rounded-xl text-sm font-mono font-bold focus:border-blue-600 focus:outline-none"
              required
            />
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 font-medium">
              {t('auth.admin_demo_hint')} <strong className="text-stone-900 dark:text-stone-200 font-bold">9876543240</strong> (District Admin Balasore)
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              {t('auth.password_label')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 rounded-xl text-sm font-bold focus:border-blue-600 focus:outline-none"
              required
            />
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 font-medium">
              {t('auth.demo_password_hint')} <strong className="text-stone-900 dark:text-stone-200 font-bold">kisan123</strong>
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-700 hover:bg-blue-800 font-bold"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t('auth.admin_login_btn')}
          </Button>
        </form>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-4 text-center text-xs">
          <Link to="/auth" className="text-kisan-700 dark:text-kisan-400 hover:underline font-bold">
            {t('auth.back_to_roles')}
          </Link>
        </div>
      </Card>
    </div>
  );
};
