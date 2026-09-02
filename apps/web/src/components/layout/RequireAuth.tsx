import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n/i18nContext';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-kisan-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-bold">{t('common.authenticating')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    const returnPath = user?.role === 'FARMER' ? '/farmer' : user?.role === 'OFFICER' ? '/officer' : user?.role === 'AUDITOR' ? '/auditor' : '/auth';
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <div className="max-w-md w-full p-8 bg-white dark:bg-stone-900 border-2 border-red-200 dark:border-red-900/50 rounded-2xl shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 rounded-full flex items-center justify-center text-2xl font-black mx-auto">
            🛡️
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-red-800 dark:text-red-400">
              403 Forbidden
            </span>
            <h1 className="text-xl font-black text-stone-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
              You don't have permission to access this page.
            </p>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Logged in as <strong className="text-stone-800 dark:text-stone-200 font-bold">{user?.role}</strong> (+91-{user?.mobile}). Role-based access control is actively enforced by Row Level Security.
          </p>
          <div className="pt-2">
            <a
              href={returnPath}
              className="inline-block w-full py-3 px-4 bg-kisan-600 hover:bg-kisan-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              Return to Your Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
