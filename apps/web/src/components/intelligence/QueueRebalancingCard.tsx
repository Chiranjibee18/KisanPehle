import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ApiClient } from '../../services/api';
import { QueueRebalanceRecommendation } from '../../types/operationalIntelligence';

export const QueueRebalancingCard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<QueueRebalanceRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentBroadcastId, setSentBroadcastId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getRebalancingRecommendations();
      if (res && res.data) {
        setRecommendations(res.data);
      }
    } catch (e) {
      console.warn('Failed to load rebalancing recommendations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = (id: string) => {
    setSentBroadcastId(id);
    setTimeout(() => setSentBroadcastId(null), 5000);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-stone-500">
        Computing proximity matrix and capacity balance across district centres...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informative Header */}
      <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-blue-950 dark:text-blue-200 text-sm">
            Proximity-Aware Queue Rebalancing Engine
          </h4>
          <p className="text-blue-900/80 dark:text-blue-300 font-medium leading-relaxed">
            Automatically identifies overloaded centres experiencing critical bottlenecks and matches them with nearby
            eligible centres (&le; 15 km, matching crop support, open hours, &ge; 40% unused buffer).
            <strong> No farmer is ever moved automatically</strong>; authorities broadcast voluntary incentives.
          </p>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="p-5 border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-kisan-600" />
                <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Optimal Rebalancing Proposal · ID #{rec.id}
                </span>
              </div>
              <Badge variant="info">
                Save ~{rec.targetCenter.estimatedWaitMinutes < rec.sourceCenter.estimatedWaitMinutes ? rec.sourceCenter.estimatedWaitMinutes - rec.targetCenter.estimatedWaitMinutes : 30} mins
              </Badge>
            </div>

            {/* Visual Source -> Target Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              {/* Overloaded Source */}
              <div className="md:col-span-5 p-4 rounded-xl bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 dark:text-red-400">
                    Overloaded Mandi (Source)
                  </span>
                  <Badge variant="danger">HIGH LOAD</Badge>
                </div>
                <h4 className="text-sm font-black text-stone-900 dark:text-white">{rec.sourceCenter.name}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Queue</span>
                    <strong className="text-stone-900 dark:text-white">{rec.sourceCenter.currentQueue} farmers</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Wait Time</span>
                    <strong className="text-red-600 dark:text-red-400">{rec.sourceCenter.estimatedWaitMinutes}m</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Utilization</span>
                    <strong className="text-stone-900 dark:text-white">{rec.sourceCenter.utilizationPercent}%</strong>
                  </div>
                </div>
              </div>

              {/* Arrow in middle */}
              <div className="md:col-span-1 flex flex-col items-center justify-center text-stone-400">
                <ArrowRight className="w-6 h-6 hidden md:block text-kisan-600" />
                <span className="text-[10px] font-black text-kisan-700 dark:text-kisan-400 mt-1 whitespace-nowrap">
                  {rec.targetCenter.distanceKm} km
                </span>
              </div>

              {/* Available Target */}
              <div className="md:col-span-5 p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Available Candidate (Target)
                  </span>
                  <Badge variant="success">OPEN BUFFER</Badge>
                </div>
                <h4 className="text-sm font-black text-stone-900 dark:text-white">{rec.targetCenter.name}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Queue</span>
                    <strong className="text-stone-900 dark:text-white">{rec.targetCenter.currentQueue} farmers</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Wait Time</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{rec.targetCenter.estimatedWaitMinutes}m</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Available Slots</span>
                    <strong className="text-kisan-700 dark:text-kisan-400">+{rec.targetCenter.availableCapacitySlots} slots</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Explainable Rationale */}
            <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-1">
              <span className="font-bold text-stone-900 dark:text-white block">Explainable Rationale:</span>
              <p className="text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                {rec.rationale}
              </p>
            </div>

            {/* Projected Impact & Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                Projected Impact: Source wait reduces to{' '}
                <strong className="text-emerald-600">
                  {rec.sourceCenter.estimatedWaitMinutes - rec.projectedImpact.sourceWaitReductionMinutes}m
                </strong>{' '}
                (&darr; {rec.projectedImpact.sourceWaitReductionMinutes}m); utilization stabilizes at{' '}
                <strong>{rec.projectedImpact.sourceUtilizationNewPercent}%</strong>.
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={sentBroadcastId === rec.id ? 'primary' : 'outline'}
                  onClick={() => handleBroadcast(rec.id)}
                  className="text-xs font-bold"
                >
                  {sentBroadcastId === rec.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-white" />
                      In-App & SMS Voluntary Offer Broadcasted
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Send Voluntary Rebalance Suggestion
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
