import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Mic,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AudioButton } from '../../components/ui/AudioButton';
import { VoiceAssistantModal } from '../../components/voice/VoiceAssistantModal';
import { ApiClient } from '../../services/api';
import { OfflineCacheService } from '../../services/offlineCache';
import { socketService } from '../../services/socket';
import { getCropDisplayName } from '../../utils/cropUtils';

export const FarmerHome: React.FC = () => {
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [queueInfo, setQueueInfo] = useState<any | null>(null);
  const [altRecommendation, setAltRecommendation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check offline cache first for instant rendering
    const cachedBooking = OfflineCacheService.getActiveBooking();
    if (cachedBooking) {
      setActiveBooking(cachedBooking);
    }

    // 2. Fetch live data from backend
    ApiClient.getMyBookings()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const latest = res.data[0];
          setActiveBooking(latest);
          OfflineCacheService.saveActiveBooking(latest);

          if (latest.centerId && latest.token) {
            fetchLiveQueue(latest.centerId, latest.token.id);
            socketService.joinCenter(latest.centerId);
          }
        }
      })
      .catch((err) => {
        console.warn('Using cached booking data:', err);
      })
      .finally(() => setLoading(false));

    // 3. Fetch alternative center recommendation
    ApiClient.getAlternativeCenters('CROP-PAD-01')
      .then((res) => {
        if (res.data?.recommendations?.length > 0) {
          setAltRecommendation(res.data.recommendations[0]);
        }
      })
      .catch(() => {});

    // 4. WebSocket real-time queue listener
    socketService.onQueueUpdated((data) => {
      if (activeBooking && activeBooking.token && data.specificTokenDetails) {
        setQueueInfo(data.specificTokenDetails);
      }
    });
  }, []);

  const fetchLiveQueue = async (centerId: string, tokenId: string) => {
    try {
      const res = await ApiClient.getQueue(centerId, tokenId);
      if (res.data?.specificTokenDetails) {
        setQueueInfo(res.data.specificTokenDetails);
      }
    } catch (e) {}
  };

  const audioSummaryText = activeBooking
    ? `${t('farmer.greeting')}. ${t('farmer.current_booking')}: ${activeBooking.token?.tokenNumber || 'A-142'}, ${t('farmer.arrive_at')}: ${activeBooking.token?.recommendedArrival || '09:15 AM'}, ${t('farmer.ahead_in_queue')}: ${queueInfo?.aheadCount ?? 6} ${t('farmer.farmers')}.`
    : `${t('farmer.greeting')}. ${t('app.tagline_full')}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Voice Assistant Hero Banner */}
      <div className="bg-gradient-to-r from-kisan-800 to-kisan-700 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-kisan-900/60 text-kisan-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('farmer.voice_badge')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {t('farmer.greeting')}
          </h1>
          <p className="text-kisan-100 text-xs sm:text-sm max-w-md">
            {t('farmer.voice_prompt')}
          </p>
        </div>

        <Button
          variant="voice"
          size="lg"
          onClick={() => setIsVoiceOpen(true)}
          leftIcon={<Mic className="w-6 h-6 animate-pulse" />}
          className="w-full sm:w-auto shadow-md"
        >
          {t('farmer.voice_btn')}
        </Button>
      </div>

      {/* Active Booking Card (If available) */}
      {activeBooking && activeBooking.token && (
        <Card variant="accent" className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-kisan-300 dark:border-kisan-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-black text-kisan-950 dark:text-kisan-100">
                {t('farmer.current_booking')}
              </h2>
            </div>
            <AudioButton text={audioSummaryText} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Token Badge */}
            <div className="bg-white dark:bg-stone-950 p-4 rounded-xl border border-kisan-300 dark:border-kisan-800 shadow-2xs text-center flex flex-col items-center justify-center">
              <span className="text-xs font-black uppercase tracking-wider text-kisan-800 dark:text-kisan-300">
                {t('farmer.token')}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-kisan-950 dark:text-white font-mono my-0.5">
                {activeBooking.token.tokenNumber}
              </span>
              <span className="text-xs text-stone-700 dark:text-stone-300 font-bold">
                {getCropDisplayName(activeBooking.crop, language, t).primary} • {activeBooking.estimatedQuantityQuintals} Q
              </span>
            </div>

            {/* Arrival & Center info */}
            <div className="bg-white dark:bg-stone-950 p-4 rounded-xl border border-kisan-300 dark:border-kisan-800 shadow-2xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-kisan-700 dark:text-kisan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-white">{activeBooking.center?.name}</div>
                  <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    {activeBooking.center?.district}, {activeBooking.center?.state}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-stone-200 dark:border-stone-800">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">{t('farmer.arrive_at')}</div>
                  <div className="text-xs font-black text-stone-900 dark:text-white">
                    {activeBooking.token.recommendedArrival}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Queue Position & Wait */}
            <div className="bg-white dark:bg-stone-950 p-4 rounded-xl border border-kisan-300 dark:border-kisan-800 shadow-2xs flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 font-medium">
                  <span>{t('farmer.ahead_in_queue')}</span>
                  <span className="font-black text-stone-900 dark:text-white">
                    {queueInfo?.aheadCount ?? 6} {t('farmer.farmers')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 font-medium">
                  <span>{t('farmer.estimated_wait')}</span>
                  <span className="font-black text-kisan-800 dark:text-kisan-300">
                    ~{queueInfo?.estimatedWaitMinutes ?? 35} {t('farmer.minutes')}
                  </span>
                </div>
              </div>

              <Link
                to={`/farmer/track`}
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-kisan-600 hover:bg-kisan-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <span>{t('farmer.track_procurement_title')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Alternative Center Smart Recommendation Banner */}
      {altRecommendation && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-amber-950 dark:text-amber-200">
              {t('farmer.alt_recommendation')}
            </div>
            <p className="text-amber-900 dark:text-amber-300 mt-0.5">
              <strong>{altRecommendation.name}</strong> ({altRecommendation.distanceKm} {t('farmer.alt_recommendation_away')}) — ~<strong>{altRecommendation.estimatedWaitMinutes} {t('farmer.alt_recommendation_wait')}</strong>.
            </p>
          </div>
          <Link
            to="/farmer/centers"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap self-center"
          >
            {t('farmer.alt_view')}
          </Link>
        </div>
      )}

      {/* 4 Primary Action Cards */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white mb-3">
          {t('farmer.what_to_do')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Book Slot */}
          <Link to="/farmer/book-slot" className="group">
            <Card
              variant="default"
              className="p-5 hover:border-kisan-500 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-13 h-13 rounded-2xl bg-kisan-100 dark:bg-kisan-950 text-kisan-900 dark:text-kisan-200 border border-kisan-300 dark:border-kisan-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                📅
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-stone-900 dark:text-white group-hover:text-kisan-800 dark:group-hover:text-kisan-300 transition-colors">
                    {t('farmer.book_slot_title')}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-kisan-600" />
                </div>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  {t('farmer.book_slot_desc')}
                </p>
              </div>
            </Card>
          </Link>

          {/* Card 2: Find Center */}
          <Link to="/farmer/centers" className="group">
            <Card
              variant="default"
              className="p-5 hover:border-kisan-500 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-13 h-13 rounded-2xl bg-earth-100 dark:bg-earth-950 text-earth-900 dark:text-earth-200 border border-earth-300 dark:border-earth-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                📍
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-stone-900 dark:text-white group-hover:text-earth-800 dark:group-hover:text-earth-300 transition-colors">
                    {t('farmer.find_center_title')}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-earth-600" />
                </div>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  {t('farmer.find_center_desc')}
                </p>
              </div>
            </Card>
          </Link>

          {/* Card 3: My Token */}
          <Link to="/farmer/token" className="group">
            <Card
              variant="default"
              className="p-5 hover:border-kisan-500 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-13 h-13 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                🎟️
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-stone-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                    {t('farmer.my_token_title')}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                </div>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  {t('farmer.my_token_desc')}
                </p>
              </div>
            </Card>
          </Link>

          {/* Card 4: Track Procurement & Payment */}
          <Link to="/farmer/track" className="group">
            <Card
              variant="default"
              className="p-5 hover:border-kisan-500 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-13 h-13 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform flex-shrink-0">
                📊
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-stone-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                    {t('farmer.track_procurement_title')}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-blue-600" />
                </div>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  {t('farmer.track_procurement_desc')}
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Trusted Helper & Helpline Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link to="/farmer/helpers">
          <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-kisan-700 dark:text-kisan-400" />
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">{t('farmer.trusted_helper')}</div>
                <div className="text-[11px] font-medium text-stone-600 dark:text-stone-400">{t('farmer.trusted_helper_desc')}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </Link>

        <Link to="/simulator">
          <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">{t('farmer.ivr_service')}</div>
                <div className="text-[11px] font-medium text-stone-600 dark:text-stone-400">{t('farmer.ivr_service_desc')}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>
        </Link>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </div>
  );
};
