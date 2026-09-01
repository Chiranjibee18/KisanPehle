import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';

interface TimelineProps {
  currentStatus: string;
}

interface Step {
  key: string;
  labelKey: any;
  defaultLabel: string;
  description: string;
}

const STEPS: Step[] = [
  {
    key: 'SCHEDULED',
    labelKey: 'status.scheduled',
    defaultLabel: 'Scheduled',
    description: 'Procurement slot booked & token issued',
  },
  {
    key: 'ARRIVED',
    labelKey: 'status.arrived',
    defaultLabel: 'Arrived',
    description: 'Gate entry pass recorded',
  },
  {
    key: 'VERIFICATION',
    labelKey: 'status.verification',
    defaultLabel: 'Verification',
    description: 'Farmer Aadhaar, land record & quota verified',
  },
  {
    key: 'INSPECTION',
    labelKey: 'status.inspection',
    defaultLabel: 'Inspection',
    description: 'Moisture %, foreign matter & weighbridge weight test',
  },
  {
    key: 'ACCEPTED',
    labelKey: 'status.accepted',
    defaultLabel: 'Accepted',
    description: 'Quality passed MSP standard specs',
  },
  {
    key: 'PROCUREMENT_COMPLETED',
    labelKey: 'status.completed',
    defaultLabel: 'Completed',
    description: 'Procurement receipt generated',
  },
  {
    key: 'PAID',
    labelKey: 'status.paid',
    defaultLabel: 'DBT Paid',
    description: 'Direct Benefit Transfer credited to bank',
  },
];

export const Timeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const { t } = useI18n();

  const getStepIndex = (status: string) => {
    if (status === 'PAYMENT_PROCESSING') return 5;
    if (status === 'REJECTED') return 3; // stopped at inspection
    const idx = STEPS.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="py-2">
      <div className="relative pl-6 border-l-2 border-stone-200 space-y-6">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex || (idx === currentIndex && currentStatus === 'PAID');
          const isCurrent = idx === currentIndex && currentStatus !== 'PAID';
          const isFailed = isRejected && idx === 3;

          return (
            <div key={step.key} className="relative group">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-[31px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-stone-900 transition-all ${
                  isDone
                    ? 'text-kisan-600 ring-2 ring-kisan-600'
                    : isCurrent
                    ? 'text-amber-600 ring-2 ring-amber-500 animate-pulse'
                    : isFailed
                    ? 'text-red-600 ring-2 ring-red-600'
                    : 'text-stone-400 dark:text-stone-500 ring-2 ring-stone-300 dark:ring-stone-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 fill-kisan-50 dark:fill-kisan-950" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 fill-amber-50 dark:fill-amber-950" />
                ) : isFailed ? (
                  <AlertCircle className="w-5 h-5 fill-red-50 dark:fill-red-950" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>

              {/* Step text content */}
              <div>
                <h4
                  className={`text-sm font-bold ${
                    isDone
                      ? 'text-kisan-900 dark:text-kisan-300'
                      : isCurrent
                      ? 'text-amber-900 dark:text-amber-300'
                      : isFailed
                      ? 'text-red-900 dark:text-red-300'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {t(step.labelKey) || step.defaultLabel}
                  {isCurrent && (
                    <span className="ml-2 inline-block text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold">
                      {t('status.in_progress')}
                    </span>
                  )}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  {t(`timeline.${step.key.toLowerCase()}` as any) || step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
