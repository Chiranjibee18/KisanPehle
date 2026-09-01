import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  CreditCard,
  FileCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Timeline } from '../../components/ui/Timeline';
import { AudioButton } from '../../components/ui/AudioButton';
import { ApiClient } from '../../services/api';
import { socketService } from '../../services/socket';
import { getCropDisplayName } from '../../utils/cropUtils';

export const ProcurementTracker: React.FC = () => {
  const { t, language } = useI18n();

  const [booking, setBooking] = useState<any | null>(null);
  const [procurementCase, setProcurementCase] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestCase();

    // Real-time socket updates
    socketService.onProcurementChanged((payload) => {
      if (payload.updatedCase) {
        setProcurementCase(payload.updatedCase);
      } else {
        fetchLatestCase();
      }
    });
  }, []);

  const fetchLatestCase = async () => {
    try {
      const res = await ApiClient.getMyBookings();
      if (res.data && res.data.length > 0) {
        const active = res.data[0];
        setBooking(active);
        if (active.procurementCase) {
          const caseRes = await ApiClient.getProcurementCaseById(active.procurementCase.id);
          if (caseRes.data) {
            setProcurementCase(caseRes.data);
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching case:', e);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = procurementCase?.currentStatus || 'SCHEDULED';
  const inspection = procurementCase?.inspection;
  const payment = procurementCase?.paymentRecord;

  const audioSummary =
    currentStatus === 'PAID'
      ? `${t('farmer.greeting')}. ${t('status.paid')}: ₹${payment?.netPayableRupees?.toLocaleString('en-IN') || '43,660'}.`
      : currentStatus === 'ACCEPTED'
      ? `${t('status.accepted')}. ${t('token.moisture')}: ${inspection?.measuredMoisturePercent || 14.2}%.`
      : `${t('farmer.track_procurement_title')}: ${t(`status.${currentStatus.toLowerCase()}` as any) || currentStatus}.`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>📊</span>
            <span>{t('farmer.track_procurement_title')}</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('farmer.track_procurement_desc')}
          </p>
        </div>

        <AudioButton text={audioSummary} size="sm" />
      </div>

      {/* Case Header Card */}
      <Card variant="default" className="p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
              {t('token.case_id')}
            </span>
            <span className="text-sm sm:text-base font-black text-stone-900 dark:text-white font-mono">
              {procurementCase?.caseNumber || 'PC-CASE-2026-142'}
            </span>
          </div>
          <Badge
            variant={
              currentStatus === 'PAID' || currentStatus === 'ACCEPTED'
                ? 'success'
                : currentStatus === 'REJECTED'
                ? 'danger'
                : 'info'
            }
          >
            {t(`status.${currentStatus.toLowerCase()}` as any) || currentStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-700 dark:text-stone-300 font-medium">
          <div>{t('token.crop')} <strong className="font-bold text-stone-900 dark:text-white">{getCropDisplayName(booking?.crop, language, t).primary}</strong></div>
          <div>{t('farmer.token')}: <strong className="font-bold text-stone-900 dark:text-white">{booking?.token?.tokenNumber || 'A-142'}</strong></div>
          <div>{t('farmer.find_center_title')}: <strong className="font-bold text-stone-900 dark:text-white">{booking?.center?.name || 'Balasore APMC'}</strong></div>
        </div>
      </Card>

      {/* Visual State Machine Timeline */}
      <Card variant="default" className="p-5 space-y-3">
        <h3 className="text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider">
          {t('journey.badge')}
        </h3>
        <Timeline currentStatus={currentStatus} />
      </Card>

      {/* Quality Inspection Details (If inspected) */}
      {inspection && (
        <Card variant="accent" className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-kisan-950 dark:text-kisan-100 font-black text-sm border-b border-kisan-300 dark:border-kisan-800 pb-2">
            <Scale className="w-4 h-4 text-kisan-700 dark:text-kisan-400" />
            <span>{t('token.inspection_title')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white dark:bg-stone-950 p-3 rounded-xl border border-kisan-300 dark:border-kisan-800 text-center">
              <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('token.moisture')}</span>
              <span className="font-black text-stone-900 dark:text-white text-base">{inspection.measuredMoisturePercent}%</span>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold block">{t('token.moisture_standard')}</span>
            </div>

            <div className="bg-white dark:bg-stone-950 p-3 rounded-xl border border-kisan-300 dark:border-kisan-800 text-center">
              <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('token.grade')}</span>
              <span className="font-black text-stone-900 dark:text-white text-base">{inspection.qualityGrade}</span>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold block">{t('token.grade_high')}</span>
            </div>

            <div className="bg-white dark:bg-stone-950 p-3 rounded-xl border border-kisan-300 dark:border-kisan-800 text-center">
              <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('token.weighed_weight')}</span>
              <span className="font-black text-stone-900 dark:text-white text-base">{inspection.weighedQuantityQuintals} Q</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">{t('farmer.estimated_qty')}</span>
            </div>

            <div className="bg-white dark:bg-stone-950 p-3 rounded-xl border border-kisan-300 dark:border-kisan-800 text-center">
              <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('token.net_procured')}</span>
              <span className="font-black text-kisan-800 dark:text-kisan-300 text-base">{inspection.netProcuredQuantityQuintals} Q</span>
              <span className="text-[10px] text-kisan-700 dark:text-kisan-400 font-bold block">{t('status.accepted')}</span>
            </div>
          </div>

          {inspection.inspectionNotes && (
            <p className="text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-950 p-2.5 rounded-lg border border-kisan-300 dark:border-kisan-800">
              📝 <strong>{t('token.officer_notes')}</strong> {inspection.inspectionNotes}
            </p>
          )}
        </Card>
      )}

      {/* Payment Information (If Completed or Paid) */}
      {payment && (
        <Card variant="highlight" className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-amber-300 dark:border-amber-800 pb-2">
            <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-black text-sm">
              <CreditCard className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{t('token.payment_title')}</span>
            </div>
            <Badge variant={payment.paymentStatus === 'PAID' ? 'success' : 'warning'}>
              {payment.paymentStatus === 'PAID' ? t('token.payment_credited') : t('token.payment_processing')}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-white dark:bg-stone-950 p-4 rounded-xl border border-amber-300 dark:border-amber-800">
            <div>
              <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('slot.msp_label')}</span>
              <span className="font-bold text-stone-900 dark:text-white">₹{payment.mspRatePerQuintal} {t('slot.per_quintal')}</span>
            </div>

            <div>
              <span className="text-stone-600 dark:text-stone-400 block text-xs font-semibold">{t('roi.total_benefit_title')}</span>
              <span className="font-black text-kisan-800 dark:text-kisan-300 text-base">
                ₹{payment.netPayableRupees?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="col-span-2 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-stone-700 dark:text-stone-300 font-medium">
              <span>{t('token.bank_account')} <strong className="font-bold text-stone-900 dark:text-white">{payment.bankAccountMasked}</strong></span>
              <span>{t('token.transaction_ref')} <strong className="font-mono text-xs font-bold text-stone-900 dark:text-white">{payment.transactionReference || 'PFMS-PENDING'}</strong></span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
