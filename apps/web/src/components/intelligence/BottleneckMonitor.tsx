import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  SlidersHorizontal,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ApiClient } from '../../services/api';
import { BottleneckAnalysis, BottleneckSeverity } from '../../types/operationalIntelligence';

interface BottleneckMonitorProps {
  district?: string;
  onSimulateCenter?: (centerId: string) => void;
  onRebalanceCenter?: (centerId: string) => void;
}

export const BottleneckMonitor: React.FC<BottleneckMonitorProps> = ({
  district = 'Balasore',
  onSimulateCenter,
  onRebalanceCenter,
}) => {
  const [centers, setCenters] = useState<BottleneckAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | BottleneckSeverity>('ALL');

  useEffect(() => {
    fetchBottlenecks();
  }, [district]);

  const fetchBottlenecks = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getBottlenecks(district);
      if (res && res.data) {
        setCenters(res.data);
      }
    } catch (e) {
      console.warn('Failed to load bottlenecks, using fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (sev: BottleneckSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            CRITICAL BOTTLENECK
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertCircle className="w-3.5 h-3.5" />
            WARNING: DELAY DETECTED
          </span>
        );
      case 'WATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5" />
            WATCH: MODERATE INFLOW
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            NORMAL OPERATIONS
          </span>
        );
    }
  };

  const filteredCenters = centers.filter((c) => {
    if (filter === 'ALL') return true;
    return c.severity === filter;
  });

  const criticalCount = centers.filter((c) => c.severity === 'CRITICAL').length;
  const warningCount = centers.filter((c) => c.severity === 'WARNING').length;
  const normalCount = centers.filter((c) => c.severity === 'NORMAL').length;

  return (
    <div className="space-y-6">
      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block uppercase">Monitored Centres</span>
            <span className="text-2xl font-black text-stone-900 dark:text-white">{centers.length}</span>
          </div>
          <Activity className="w-8 h-8 text-stone-400" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20">
          <div>
            <span className="text-xs font-bold text-red-700 dark:text-red-400 block uppercase">Critical Bottlenecks</span>
            <span className="text-2xl font-black text-red-700 dark:text-red-400">{criticalCount}</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-amber-200 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/20">
          <div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block uppercase">Under Delay Watch</span>
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{warningCount}</span>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block uppercase">Flow Normal</span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{normalCount}</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          {(['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'NORMAL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === tab
                  ? 'bg-kisan-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {tab === 'ALL' ? 'All Centres' : tab}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          Rule-based operational detection · Updated in real-time
        </span>
      </div>

      {/* Centres List */}
      <div className="space-y-4">
        {filteredCenters.map((c) => (
          <Card
            key={c.centerId}
            className={`p-5 space-y-4 transition-all ${
              c.severity === 'CRITICAL'
                ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10'
                : c.severity === 'WARNING'
                ? 'border-amber-300 dark:border-amber-800'
                : 'border-stone-200 dark:border-stone-800'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-black text-stone-900 dark:text-white">{c.centerName}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold">
                    {c.centerCode}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  {c.district} District · {c.metrics.activeCounters} Weighing Counters Active
                </p>
              </div>

              <div className="flex items-center gap-2">
                {getSeverityBadge(c.severity)}
                {c.trend === 'INCREASING' && (
                  <span className="inline-flex items-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Queue Rising
                  </span>
                )}
                {c.trend === 'DECREASING' && (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> Inflow Easing
                  </span>
                )}
                {c.trend === 'STABLE' && (
                  <span className="inline-flex items-center text-xs font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    <Minus className="w-3.5 h-3.5 mr-0.5" /> Stable
                  </span>
                )}
              </div>
            </div>

            {/* Key Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-white dark:bg-stone-900/80 rounded-xl border border-stone-200 dark:border-stone-800 text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block font-semibold">Active Queue</span>
                <span className="text-base font-black text-stone-900 dark:text-white">
                  {c.metrics.currentQueue} <span className="text-xs font-normal text-stone-500">farmers</span>
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block font-semibold">Estimated Wait</span>
                <span
                  className={`text-base font-black ${
                    c.metrics.estimatedWaitMinutes > 45
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-stone-900 dark:text-white'
                  }`}
                >
                  {c.metrics.estimatedWaitMinutes}m{' '}
                  <span className="text-[10px] text-stone-400 font-normal">
                    (tgt: {c.metrics.targetWaitMinutes}m)
                  </span>
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block font-semibold">Capacity Utilization</span>
                <span className="text-base font-black text-stone-900 dark:text-white">
                  {c.metrics.utilizationPercent}%
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block font-semibold">Arrival vs Service Rate</span>
                <span className="text-base font-black text-stone-900 dark:text-white">
                  {c.metrics.arrivalRatePerHour} / {c.metrics.processingRatePerHour}{' '}
                  <span className="text-[10px] text-stone-400 font-normal">/hr</span>
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block font-semibold">Completed Today</span>
                <span className="text-base font-black text-kisan-700 dark:text-kisan-400">
                  {c.metrics.completedToday}{' '}
                  <span className="text-[10px] text-stone-400 font-normal">tokens</span>
                </span>
              </div>
            </div>

            {/* Explainable Reasons */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                Detection Rationale & Operational Factors
              </span>
              <div className="space-y-1.5">
                {c.reasons.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs"
                  >
                    <div className="mt-0.5">
                      {c.severity === 'CRITICAL' ? (
                        <span className="w-2 h-2 rounded-full bg-red-600 block" />
                      ) : c.severity === 'WARNING' ? (
                        <span className="w-2 h-2 rounded-full bg-amber-500 block" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                      )}
                    </div>
                    <div className="flex-1">
                      <strong className="font-bold text-stone-900 dark:text-stone-100">{r.title}:</strong>{' '}
                      <span className="text-stone-600 dark:text-stone-300 font-medium">{r.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="text-[11px] text-stone-500 font-medium">
                No-Show Rate: <strong>{c.metrics.noShowRatePercent}%</strong> · Processing Buffer:{' '}
                <strong>{c.metrics.avgProcessingMinutes} mins/token</strong>
              </div>

              <div className="flex items-center gap-2">
                {onSimulateCenter && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSimulateCenter(c.centerId)}
                    className="text-xs font-bold"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                    Simulate Capacity
                  </Button>
                )}

                {c.severity === 'CRITICAL' && onRebalanceCenter && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onRebalanceCenter(c.centerId)}
                    className="text-xs font-bold bg-kisan-700 hover:bg-kisan-800"
                  >
                    Rebalance Inflow
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
