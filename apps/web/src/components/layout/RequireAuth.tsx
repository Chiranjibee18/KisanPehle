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
    // If logged in as farmer trying to access officer, redirect to /farmer
    if (user?.role === 'FARMER') return <Navigate to="/farmer" replace />;
    if (user?.role === 'OFFICER') return <Navigate to="/officer" replace />;
    if (user?.role === 'DISTRICT_ADMIN' || user?.role === 'STATE_ADMIN') return <Navigate to="/admin" replace />;
    if (user?.role === 'AUDITOR') return <Navigate to="/auditor" replace />;
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
