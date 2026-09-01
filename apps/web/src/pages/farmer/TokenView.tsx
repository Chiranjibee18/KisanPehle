import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  MapPin,
  Clock,
  Users,
  QrCode,
  Volume2,
  Share2,
  Download,
  AlertCircle,
  RefreshCw,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AudioButton } from '../../components/ui/AudioButton';
import { ApiClient } from '../../services/api';
import { OfflineCacheService } from '../../services/offlineCache';
import { socketService } from '../../services/socket';
import { getCropDisplayName } from '../../utils/cropUtils';

export const TokenView: React.FC = () => {
  const { t, speak, language } = useI18n();

  const [booking, setBooking] = useState<any | null>(null);
  const [queueData, setQueueData] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    // 1. Load cached booking first
    const cached = OfflineCacheService.getActiveBooking();
    if (cached) setBooking(cached);

    // 2. Fetch live data
    refreshData();

    // 3. Socket updates
    socketService.onQueueUpdated((data) => {
      if (data.specificTokenDetails) {
        setQueueData(data.specificTokenDetails);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await ApiClient.getMyBookings();
      if (res.data && res.data.length > 0) {
        const active = res.data[0];
        setBooking(active);
        OfflineCacheService.saveActiveBooking(active);

        if (active.centerId && active.token) {
          const qRes = await ApiClient.getQueue(active.centerId, active.token.id);
          if (qRes.data?.specificTokenDetails) {
            setQueueData(qRes.data.specificTokenDetails);
          }
        }
      }
    } catch (e) {
      console.warn('Using offline token cache');
    } finally {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  const tokenNumber = booking?.token?.tokenNumber || 'A-142';
  const centerName = booking?.center?.name || 'Balasore Main APMC';
  const recommendedArrival = booking?.token?.recommendedArrival || '09:15 AM';
  const aheadCount = queueData?.aheadCount ?? 6;
  const waitMinutes = queueData?.estimatedWaitMinutes ?? 35;

  const audioSummary = `${t('farmer.greeting')}. ${t('token.title')}: ${tokenNumber}. ${centerName}. ${t('farmer.arrive_at')}: ${recommendedArrival}. ${t('farmer.ahead_in_queue')}: ${aheadCount}. ${t('farmer.estimated_wait')}: ~${waitMinutes} ${t('farmer.minutes')}.`;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Header with audio read-aloud */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>🎟️</span>
            <span>{t('farmer.my_token_title')}</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('farmer.my_token_desc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
            title="Refresh queue"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <AudioButton text={audioSummary} size="sm" />
        </div>
      </div>

      {/* Main Digital Token Pass Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-kisan-600 shadow-xl overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Token Header Banner */}
        <div className="bg-gradient-to-r from-kisan-700 to-kisan-800 text-white p-6 text-center space-y-1 relative">
          <div className="text-xs font-black uppercase tracking-widest text-kisan-200">
            {t('token.pass_badge')}
          </div>
          <div className="text-5xl sm:text-6xl font-black tracking-tight font-mono py-1">
            {tokenNumber}
          </div>
          <div className="text-xs font-bold text-kisan-100">
            {booking?.bookingNumber || 'BK-BAL-2026-142'}
          </div>

          {/* Notch cuts for ticket visual */}
          <div className="absolute -left-3.5 -bottom-3.5 w-7 h-7 rounded-full bg-stone-50 dark:bg-stone-950 border-r-2 border-kisan-600" />
          <div className="absolute -right-3.5 -bottom-3.5 w-7 h-7 rounded-full bg-stone-50 dark:bg-stone-950 border-l-2 border-kisan-600" />
        </div>

        {/* Live Queue Tracker Box */}
        <div className="p-5 sm:p-6 space-y-5 bg-stone-50/70 dark:bg-stone-950/80">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('farmer.ahead_in_queue')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-mono mt-0.5 block">
                {aheadCount}
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">{t('farmer.farmers')}</span>
            </div>

            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('farmer.estimated_wait')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-kisan-800 dark:text-kisan-300 font-mono mt-0.5 block">
                ~{waitMinutes}m
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">{t('farmer.minutes')}</span>
            </div>
          </div>

          {/* Center and Recommended Arrival */}
          <div className="space-y-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-kisan-700 dark:text-kisan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-stone-900 dark:text-white block text-sm">{centerName}</span>
                <span className="text-stone-600 dark:text-stone-300 font-medium block">
                  {booking?.center?.address || 'Station Road, APMC Yard, Balasore'}
                </span>
                <span className="text-kisan-700 dark:text-kisan-400 font-bold block mt-0.5">
                  {t('token.helpline')} {booking?.center?.contactNumber || '+91 6782-262100'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-stone-600 dark:text-stone-400 font-semibold block">{t('farmer.arrive_at')}</span>
                <span className="font-black text-stone-900 dark:text-white text-sm">{recommendedArrival}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium">
              <span>{t('token.crop')} <strong className="font-bold text-stone-900 dark:text-white">{getCropDisplayName(booking?.crop, language, t).primary}</strong></span>
              <span>{t('token.quantity')} <strong className="font-bold text-stone-900 dark:text-white">{booking?.estimatedQuantityQuintals || 25} Q</strong></span>
              <span>{t('token.vehicle')} <strong className="font-bold text-stone-900 dark:text-white">{booking?.vehicleNumber || 'OD-01-AB-1234'}</strong></span>
            </div>
          </div>

          {/* Verification QR representation */}
          <div className="flex items-center justify-between p-3.5 bg-kisan-50 dark:bg-kisan-950/80 rounded-xl border border-kisan-300 dark:border-kisan-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-stone-900 border border-kisan-300 dark:border-kisan-700 flex items-center justify-center text-kisan-800 dark:text-kisan-300">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-black text-kisan-950 dark:text-kisan-100">{t('token.qr_title')}</div>
                <div className="text-xs font-semibold text-kisan-800 dark:text-kisan-300">{t('token.qr_desc')}</div>
              </div>
            </div>
            <Badge variant="success">{t('token.qr_valid')}</Badge>
          </div>

          {/* Last updated timestamp */}
          <div className="text-center text-xs font-medium text-stone-500 dark:text-stone-400">
            {t('common.last_updated')}: {lastUpdated} • {t('token.offline_guaranteed')}
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/farmer/track"
              className="py-3 px-4 bg-kisan-600 hover:bg-kisan-700 text-white rounded-xl text-center text-xs font-black transition-colors shadow-xs"
            >
              {t('token.track_progress')}
            </Link>
            <Link
              to="/farmer/centers"
              className="py-3 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-xl text-center text-xs font-black transition-colors border border-stone-300 dark:border-stone-700"
            >
              {t('token.mandi_status')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
