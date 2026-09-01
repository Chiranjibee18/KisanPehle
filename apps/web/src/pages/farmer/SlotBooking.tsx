import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, CheckCircle2, MapPin, Clock, Truck, User, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AudioButton } from '../../components/ui/AudioButton';
import { ApiClient } from '../../services/api';
import { OfflineCacheService } from '../../services/offlineCache';
import { getCropDisplayName } from '../../utils/cropUtils';

export const SlotBooking: React.FC = () => {
  const { t, speak, language } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCenterId = searchParams.get('centerId');
  const preselectedCropId = searchParams.get('cropId');

  const [step, setStep] = useState<number>(1);
  const [crops, setCrops] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // Form State
  const [selectedCropId, setSelectedCropId] = useState<string>(preselectedCropId || '');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(25);
  const [selectedCenterId, setSelectedCenterId] = useState<string>(preselectedCenterId || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('TRACTOR_TROLLEY');
  const [vehicleNumber, setVehicleNumber] = useState<string>('OD-01-AB-1234');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([ApiClient.getCrops(), ApiClient.getCenters()])
      .then(([cropsRes, centersRes]) => {
        if (cropsRes.data) {
          setCrops(cropsRes.data);
          if (!selectedCropId && cropsRes.data.length > 0) {
            setSelectedCropId(cropsRes.data[0].id);
          }
        }
        if (centersRes.data) {
          setCenters(centersRes.data);
          if (!selectedCenterId && centersRes.data.length > 0) {
            setSelectedCenterId(centersRes.data[0].id);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch slots whenever center, crop, or date changes
  useEffect(() => {
    if (selectedCenterId && selectedDate) {
      ApiClient.getCenterSchedules(selectedCenterId, selectedDate, selectedCropId)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setSchedules(res.data);
            const slots = res.data[0].slots || [];
            setAvailableSlots(slots);
            if (slots.length > 0 && !selectedSlotTime) {
              const firstAvailable = slots.find((s: any) => s.isAvailable);
              if (firstAvailable) setSelectedSlotTime(firstAvailable.slotTime);
            }
          }
        })
        .catch(() => {});
    }
  }, [selectedCenterId, selectedDate, selectedCropId]);

  const selectedCrop = crops.find((c) => c.id === selectedCropId);
  const selectedCenter = centers.find((c) => c.id === selectedCenterId);

  const handleBookingSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    // Generate unique idempotency key
    const idempotencyKey = `idem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const payload = {
        cropId: selectedCropId,
        centerId: selectedCenterId,
        date: selectedDate,
        slotTime: selectedSlotTime || '09:00 AM - 09:20 AM',
        estimatedQuantityQuintals: quantityQuintals,
        vehicleType,
        vehicleNumber,
        idempotencyKey,
      };

      const res = await ApiClient.createBooking(payload, idempotencyKey);
      if (res.data) {
        // Save to offline cache
        OfflineCacheService.saveActiveBooking(res.data);

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Audio Confirmation
        speak(
          `${t('farmer.greeting')}! ${t('farmer.token')} ${res.data.token?.tokenNumber || 'A-142'}. ${selectedCenter?.name}. ${selectedSlotTime}.`,
        );

        navigate('/farmer/token');
      }
    } catch (err: any) {
      setError(err.message || t('slot.error_booking'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>📅</span>
            <span>{t('slot.step_title')}</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('slot.step_indicator', { step })} {step === 1 ? t('slot.step1_label') : step === 2 ? t('slot.step2_label') : t('slot.step3_label')}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                step === s
                  ? 'bg-kisan-600 text-white ring-2 ring-kisan-300'
                  : step > s
                  ? 'bg-kisan-100 dark:bg-kisan-900 text-kisan-900 dark:text-kisan-200'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-400'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-xs text-red-900 dark:text-red-200 font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Crop Selection & Quantity */}
      {step === 1 && (
        <Card variant="default" className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-2">
              1. {t('center.select_crop')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crops.map((c) => {
                const cropNames = getCropDisplayName(c, language, t);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCropId(c.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedCropId === c.id
                        ? 'border-kisan-600 bg-kisan-50/90 dark:bg-kisan-950/90 shadow-xs'
                        : 'border-stone-300 dark:border-stone-700 hover:border-kisan-400 dark:hover:border-kisan-500 bg-stone-50/80 dark:bg-stone-950'
                    }`}
                  >
                    <div className="font-black text-sm text-stone-900 dark:text-white">{cropNames.primary}</div>
                    {cropNames.secondary && (
                      <div className="text-xs font-semibold text-stone-600 dark:text-stone-400">{cropNames.secondary}</div>
                    )}
                    <div className="text-xs font-bold text-kisan-800 dark:text-kisan-300 mt-1">
                      {t('slot.msp_label')} ₹{c.minSupportPrice} {t('slot.per_quintal')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1">
              2. {t('slot.estimated_qty')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={200}
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                className="w-36 px-4 py-3 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-black text-lg focus:border-kisan-500 focus:outline-none"
              />
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">{t('roi.qtl')}</span>
            </div>
            {selectedCrop && (
              <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-1.5">
                {t('slot.estimated_val')} <strong className="font-bold text-stone-900 dark:text-white">₹{(quantityQuintals * selectedCrop.minSupportPrice).toLocaleString('en-IN')}</strong>
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              className="font-bold"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('slot.next')}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Center & Slot Time Selection */}
      {step === 2 && (
        <Card variant="default" className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-2">
              1. {t('slot.select_center')}
            </label>
            <select
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-bold text-sm focus:border-kisan-500 focus:outline-none"
            >
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district}) — {c.currentStatus === 'ACTIVE' ? t('center.status.active') : c.currentStatus}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-2">
              2. {t('slot.select_date')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-bold text-sm focus:border-kisan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-2">
              3. {t('slot.select_time')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.isAvailable}
                  onClick={() => setSelectedSlotTime(slot.slotTime)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    selectedSlotTime === slot.slotTime
                      ? 'border-kisan-600 bg-kisan-600 text-white shadow-xs'
                      : slot.isAvailable
                      ? 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 hover:border-kisan-500 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold">{slot.slotTime}</div>
                  <div className="text-[10px] mt-0.5 font-semibold opacity-90">
                    {slot.isAvailable ? `${slot.maxBookings - slot.bookedCount} ${t('slot.slots_available')}` : t('slot.slot_full')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <Button variant="ghost" size="md" className="font-bold" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {t('slot.back')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="font-bold"
              onClick={() => setStep(3)}
              disabled={!selectedSlotTime}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t('slot.next')}
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Vehicle details & Final Confirmation */}
      {step === 3 && (
        <Card variant="default" className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-2">
              {t('slot.vehicle_type')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'TRACTOR_TROLLEY', label: t('slot.veh_tractor') },
                { key: 'MINI_TRUCK', label: t('slot.veh_pickup') },
                { key: 'BULLOCK_CART', label: t('slot.veh_cart') },
              ].map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVehicleType(v.key)}
                  className={`p-3 rounded-xl border-2 text-center text-xs font-black transition-all cursor-pointer ${
                    vehicleType === v.key
                      ? 'border-kisan-600 bg-kisan-50 dark:bg-kisan-950 text-kisan-950 dark:text-kisan-200 shadow-xs'
                      : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1">
              {t('slot.vehicle_number')}
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="OD-01-AB-1234"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 font-mono font-black text-sm uppercase focus:border-kisan-500 focus:outline-none"
            />
          </div>

          {/* Booking Summary Box */}
          <div className="bg-stone-100 dark:bg-stone-950 p-4 rounded-xl border border-stone-300 dark:border-stone-800 text-xs space-y-2">
            <h4 className="font-black text-stone-900 dark:text-white uppercase tracking-wider">{t('slot.summary_title')}</h4>
            <div className="grid grid-cols-2 gap-2 text-stone-800 dark:text-stone-200 font-medium">
              <div>{t('token.crop')} <strong className="font-bold text-stone-900 dark:text-white">{getCropDisplayName(selectedCrop, language, t).primary}</strong></div>
              <div>{t('token.quantity')} <strong className="font-bold text-stone-900 dark:text-white">{quantityQuintals} {t('roi.qtl')}</strong></div>
              <div>{t('farmer.find_center_title')}: <strong className="font-bold text-stone-900 dark:text-white">{selectedCenter?.name}</strong></div>
              <div>{t('slot.select_time')}: <strong className="font-bold text-stone-900 dark:text-white">{selectedDate} • {selectedSlotTime}</strong></div>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <Button variant="ghost" size="md" className="font-bold" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              {t('slot.back')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="font-bold"
              isLoading={isSubmitting}
              onClick={handleBookingSubmit}
              rightIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              {t('slot.confirm_btn')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
