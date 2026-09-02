import React, { useState, useEffect } from 'react';
import {
  UserX,
  Users,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  TrendingDown,
  AlertCircle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ApiClient } from '../../services/api';
import { NoShowMetrics } from '../../types/operationalIntelligence';

export const NoShowIntelligenceCard: React.FC = () => {
  const [data, setData] = useState<NoShowMetrics | null>(null);
  const [policyActive, setPolicyActive] = useState(false);

  useEffect(() => {
    fetchNoShow();
  }, []);

  const fetchNoShow = async () => {
    try {
      const res = await ApiClient.getNoShowAnalysis();
      if (res && res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.warn('Failed to load no-show analysis:', e);
    }
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* High-level summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase block">Total Booked Slots</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-stone-900 dark:text-white">{data.bookedSlots}</span>
            <CalendarCheck className="w-6 h-6 text-stone-400" />
          </div>
          <span className="text-[11px] text-stone-400 font-medium">District registered today</span>
        </Card>

        <Card className="p-4 border-stone-200 dark:border-stone-800 space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase block">Arrived & Verified</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{data.arrivedFarmers}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round((data.arrivedFarmers / data.bookedSlots) * 100)}% attendance rate
          </span>
        </Card>

        <Card className="p-4 border-amber-200 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase block">Farmer No-Shows</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{data.noShows}</span>
            <UserX className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-[11px] text-amber-600 font-bold">{data.noShowRatePercent}% no-show rate</span>
        </Card>

        <Card className="p-4 border-blue-200 dark:border-blue-950 bg-blue-50/40 dark:bg-blue-950/20 space-y-1">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase block">Recoverable Slots</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400">
              {data.potentiallyRecoverableSlots}
            </span>
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Via dynamic confirmation</span>
        </Card>
      </div>

      {/* Deep Operational Impact Analysis */}
      <Card className="p-5 border-stone-200 dark:border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Operational Capacity Leakage Analysis
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Quantifying unutilized mandi capacity caused by unattended digital reservations.
            </p>
          </div>
          <Badge variant="warning">{data.unusedCapacityQuintals} Quintals Unused Capacity</Badge>
        </div>

        {/* Visual Progress Ratio */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
            <span>Booking Realization Breakdown</span>
            <span>{data.arrivedFarmers} of {data.bookedSlots} slots utilized</span>
          </div>
          <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(data.completedProcurements / data.bookedSlots) * 100}%` }}
              className="bg-kisan-600 h-full"
              title="Completed Procurements"
            />
            <div
              style={{ width: `${((data.arrivedFarmers - data.completedProcurements) / data.bookedSlots) * 100}%` }}
              className="bg-blue-500 h-full"
              title="Currently in Yard Queue"
            />
            <div
              style={{ width: `${(data.cancelledBookings / data.bookedSlots) * 100}%` }}
              className="bg-stone-400 h-full"
              title="Advance Cancellations"
            />
            <div
              style={{ width: `${(data.noShows / data.bookedSlots) * 100}%` }}
              className="bg-amber-500 h-full"
              title="Unannounced No-Shows"
            />
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] font-medium text-stone-600 dark:text-stone-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-kisan-600 inline-block" /> Completed (
              {data.completedProcurements})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" /> In Queue ({data.arrivedFarmers - data.completedProcurements})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-stone-400 inline-block" /> Cancelled ({data.cancelledBookings})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" /> Unannounced No-Shows ({data.noShows})
            </span>
          </div>
        </div>

        {/* Explainable Recommendation */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Operational Directive</span>
          </div>
          <p className="text-amber-900/90 dark:text-amber-300 font-medium leading-relaxed">
            {data.recommendation}
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              Policy standard: Overbooking buffer limited to statutory 8% maximum.
            </span>
            <Button
              size="sm"
              variant={policyActive ? 'primary' : 'outline'}
              onClick={() => setPolicyActive(!policyActive)}
              className="text-xs font-bold"
            >
              {policyActive ? '✓ 90-Min SMS Gate Confirmation Active' : 'Enable 90-Min SMS Confirmation'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
