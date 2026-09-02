import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Clock,
  Users,
  Scale,
  SlidersHorizontal,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CenterAdvancedDiagnosticsModalProps {
  center: any;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const CenterAdvancedDiagnosticsModal: React.FC<CenterAdvancedDiagnosticsModalProps> = ({
  center,
  onClose,
  onNavigateToTab,
}) => {
  if (!center) return null;

  const isBottleneck = center.isBottleneck || center.utilizationPercent > 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-kisan-700 dark:text-kisan-400 uppercase tracking-wider">
                Advanced Centre Diagnostics
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">
                {center.code}
              </span>
            </div>
            <h3 className="text-lg font-black text-stone-900 dark:text-white mt-0.5">{center.name}</h3>
            <p className="text-xs text-stone-500 font-medium">
              {center.district} District · Mandi Terminal
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-stone-800 dark:text-stone-200">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Current Operational Status</span>
              <strong className="text-xs font-black text-stone-900 dark:text-white">{center.status}</strong>
            </div>
            <Badge variant={isBottleneck ? 'danger' : 'success'}>
              {isBottleneck ? 'BOTTLENECK DETECTED' : 'NORMAL INFLOW'}
            </Badge>
          </div>

          {/* Core Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-500 block text-[10px] font-semibold">Active Queue</span>
              <span className="text-base font-black text-stone-900 dark:text-white">
                {center.tokensToday - center.completedToday} farmers
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-500 block text-[10px] font-semibold">Average Wait</span>
              <span className="text-base font-black text-stone-900 dark:text-white">
                {center.currentWaitMinutes} mins
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-500 block text-[10px] font-semibold">Today's Bookings</span>
              <span className="text-base font-black text-stone-900 dark:text-white">
                {center.tokensToday} tokens
              </span>
            </div>

            <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <span className="text-stone-500 block text-[10px] font-semibold">Completed Procurement</span>
              <span className="text-base font-black text-kisan-700 dark:text-kisan-400">
                {center.completedToday} ({center.procuredQuintals} Q)
              </span>
            </div>
          </div>

          {/* Bottleneck Explanation */}
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              isBottleneck
                ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
            }`}
          >
            <span className="font-black uppercase tracking-wider block">
              {isBottleneck ? 'Bottleneck Diagnostic Reason' : 'Operational Flow Assessment'}
            </span>
            <p className="font-medium leading-relaxed">
              {isBottleneck
                ? `Capacity utilization is at ${center.utilizationPercent}%, operating with only ${center.activeCounters} active counters. Average wait time has risen to ${center.currentWaitMinutes}m, exceeding recommended SLA.`
                : `Optimal yard throughput. Utilization is healthy at ${center.utilizationPercent}%, with ${center.activeCounters} counters providing smooth farmer turnover.`}
            </p>
          </div>

          {/* Action Links */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 block">
              Operational Actions & Modules
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigateToTab('SIMULATION');
                }}
                className="text-xs font-bold justify-start"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2 text-kisan-700" />
                Run What-If Simulation
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigateToTab('BOTTLENECK');
                }}
                className="text-xs font-bold justify-start"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
                View Bottleneck & Rebalance
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigateToTab('GRIEVANCE');
                }}
                className="text-xs font-bold justify-start"
              >
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                View Farmer Grievances
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigateToTab('AUDIT');
                }}
                className="text-xs font-bold justify-start"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                Verify Tamper-Evident Audit Trail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
