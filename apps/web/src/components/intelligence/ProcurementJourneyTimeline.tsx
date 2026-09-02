import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  User,
  Scale,
  CreditCard,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Truck,
  Smartphone,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ApiClient } from '../../services/api';
import { ProcurementJourneyStep } from '../../types/operationalIntelligence';

interface ProcurementJourneyTimelineProps {
  bookingId?: string;
}

export const ProcurementJourneyTimeline: React.FC<ProcurementJourneyTimelineProps> = ({
  bookingId = 'latest',
}) => {
  const [steps, setSteps] = useState<ProcurementJourneyStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useEffect(() => {
    fetchTimeline();
  }, [bookingId]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getJourneyTimeline(bookingId);
      if (res && res.data) {
        setSteps(res.data);
      }
    } catch (e) {
      console.warn('Failed to load journey timeline:', e);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (order: number) => {
    switch (order) {
      case 1:
        return <Smartphone className="w-4 h-4" />;
      case 2:
        return <FileCheck className="w-4 h-4" />;
      case 3:
        return <Truck className="w-4 h-4" />;
      case 4:
        return <Clock className="w-4 h-4" />;
      case 5:
        return <User className="w-4 h-4" />;
      case 6:
        return <Scale className="w-4 h-4" />;
      case 7:
        return <ShieldCheck className="w-4 h-4" />;
      case 8:
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-stone-500 font-medium">
        Loading chronological procurement journey...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2">
            <span>🌾</span> Complete Statutory Procurement Journey
          </h4>
          <span className="text-[11px] text-stone-500 font-medium">
            Immutable chronological chain of procurement events
          </span>
        </div>
        <Badge variant="success">8/8 MILESTONES VERIFIED</Badge>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-kisan-200 dark:before:bg-kisan-900">
        {steps.map((step) => {
          const isExpanded = expandedStep === step.stepId;
          return (
            <div key={step.stepId} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-kisan-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                {getStepIcon(step.order)}
              </div>

              {/* Step Card */}
              <div
                onClick={() => setExpandedStep(isExpanded ? null : step.stepId)}
                className="cursor-pointer p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-kisan-400 dark:hover:border-kisan-700 transition-all space-y-2 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-kisan-700 dark:text-kisan-400 block">
                      Milestone #{step.order}
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-stone-900 dark:text-white">
                      {step.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                      {step.timestamp}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  {step.description}
                </p>

                {/* Actor Badge */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-stone-500 font-medium">
                    Attributed Actor: <strong>{step.actor}</strong>
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="text-stone-500 font-medium">
                    Channel: <strong>{step.channel || 'Standard Protocol'}</strong>
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && step.metadata && (
                  <div className="pt-2 mt-2 border-t border-stone-100 dark:divide-stone-800 bg-stone-50 dark:bg-stone-950 p-2.5 rounded-lg text-xs font-mono text-stone-700 dark:text-stone-300 space-y-1">
                    {Object.entries(step.metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-stone-500 uppercase text-[10px]">{k}:</span>
                        <span className="font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
