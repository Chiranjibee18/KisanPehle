import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Scale, Search, Sparkles, Filter, ChevronRight, Phone } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AudioButton } from '../../components/ui/AudioButton';
import { ApiClient } from '../../services/api';
import { getCropDisplayName } from '../../utils/cropUtils';

export const CenterDiscovery: React.FC = () => {
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const [centers, setCenters] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ApiClient.getCrops(), ApiClient.getCenters()])
      .then(([cropsRes, centersRes]) => {
        if (cropsRes.data) {
          setCrops(cropsRes.data);
          if (cropsRes.data.length > 0) setSelectedCrop(cropsRes.data[0].id);
        }
        if (centersRes.data) setCenters(centersRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = async (cropId: string, status: string) => {
    setSelectedCrop(cropId);
    setSelectedStatus(status);
    setLoading(true);
    try {
      const res = await ApiClient.getCenters({
        cropId: cropId || undefined,
        status: status !== 'ALL' ? status : undefined,
      });
      if (res.data) setCenters(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>📍</span>
            <span>{t('farmer.find_center_title')}</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('farmer.find_center_desc')}
          </p>
        </div>
        <AudioButton
          text={`${t('center.search_placeholder')}. ${t('farmer.find_center_desc')}`}
          size="sm"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card variant="default" className="p-4 space-y-3">
        {/* Crop Selector Tabs */}
        <div>
          <label className="block text-xs font-black text-stone-900 dark:text-stone-100 mb-1.5 uppercase tracking-wider">
            {t('center.select_crop')}
          </label>
          <div className="flex flex-wrap gap-2">
            {crops.map((crop) => {
              const cropNames = getCropDisplayName(crop, language, t);
              return (
                <button
                  key={crop.id}
                  onClick={() => handleFilterChange(crop.id, selectedStatus)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedCrop === crop.id
                      ? 'border-kisan-600 bg-kisan-600 text-white shadow-xs'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {cropNames.primary} (₹{crop.minSupportPrice}/Q)
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input & Status Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-500 dark:text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('center.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 rounded-lg text-xs font-medium focus:ring-2 focus:ring-kisan-500 focus:outline-none"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(selectedCrop, e.target.value)}
              className="w-full py-2.5 px-3 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-kisan-500 focus:outline-none"
            >
              <option value="ALL">{t('center.all_statuses')}</option>
              <option value="ACTIVE">{t('center.status.active')}</option>
              <option value="LIMITED_CAPACITY">{t('center.status.limited_capacity')}</option>
              <option value="PAUSED">{t('center.status.paused')}</option>
              <option value="CLOSED">{t('center.status.closed')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Centers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-stone-500 dark:text-stone-400 text-sm font-medium">
            {t('common.loading')}
          </div>
        ) : filteredCenters.length === 0 ? (
          <Card className="p-8 text-center text-stone-600 dark:text-stone-400 text-sm font-medium">
            {t('common.no_data')}
          </Card>
        ) : (
          filteredCenters.map((center) => {
            const isAvailable = center.currentStatus === 'ACTIVE' || center.currentStatus === 'LIMITED_CAPACITY';

            return (
              <Card
                key={center.id}
                variant="default"
                className="p-5 hover:border-kisan-400 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-base text-stone-900 dark:text-white">
                        {center.name}
                      </h3>
                      <Badge
                        variant={
                          center.currentStatus === 'ACTIVE'
                            ? 'active'
                            : center.currentStatus === 'LIMITED_CAPACITY'
                            ? 'limited'
                            : center.currentStatus === 'PAUSED'
                            ? 'paused'
                            : 'closed'
                        }
                      >
                        {t(`center.status.${center.currentStatus.toLowerCase()}` as any) || center.currentStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                      <span>{center.address}</span>
                      <span className="font-bold text-kisan-700 dark:text-kisan-400 ml-2">
                        • {center.distanceKm} {t('farmer.alt_recommendation_away')}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 sm:self-start">
                    <Clock className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                    <span>{center.operatingHours}</span>
                  </div>
                </div>

                {/* Queue & Capacity Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-100 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
                  <div>
                    <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('center.active_queue')}</span>
                    <span className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      {center.activeQueueCount} {t('farmer.farmers')}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('center.estimated_wait')}</span>
                    <span className="font-black text-kisan-800 dark:text-kisan-300 text-sm flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-kisan-700 dark:text-kisan-400" />
                      ~{center.estimatedWaitMinutes} {t('farmer.minutes')}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('center.active_counters')}</span>
                    <span className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-1 mt-0.5">
                      <Scale className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      {center.activeCounters}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('center.daily_capacity')}</span>
                    <span className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-1 mt-0.5">
                      {center.maxDailyCapacityQuintals} Q
                    </span>
                  </div>
                </div>

                {/* Status reason notice if limited or paused */}
                {center.statusReason && (
                  <p className="text-xs font-medium text-stone-700 dark:text-stone-300 bg-amber-50 dark:bg-amber-950/80 p-2.5 rounded-lg border border-amber-300 dark:border-amber-700">
                    ℹ️ <strong>{t('common.view')}:</strong> {center.statusReason}
                  </p>
                )}

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                    {t('center.supported_crops')} {center.supportedCrops?.map((c: any) => getCropDisplayName(c, language, t).primary).join(', ') || t('crop.paddy')}
                  </span>

                  <Button
                    variant={isAvailable ? 'primary' : 'outline'}
                    size="md"
                    className="font-bold"
                    disabled={!isAvailable}
                    onClick={() => navigate(`/farmer/book-slot?centerId=${center.id}&cropId=${selectedCrop}`)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    {isAvailable ? t('center.book_slot') : t('center.unavailable')}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
