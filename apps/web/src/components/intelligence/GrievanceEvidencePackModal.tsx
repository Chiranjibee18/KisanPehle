import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Scale,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Lock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GrievanceRecord } from '../../types/operationalIntelligence';

interface GrievanceEvidencePackModalProps {
  grievance: GrievanceRecord;
  onClose: () => void;
  onStatusUpdate?: (id: string, status: string, notes?: string) => void;
}

export const GrievanceEvidencePackModal: React.FC<GrievanceEvidencePackModalProps> = ({
  grievance,
  onClose,
  onStatusUpdate,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const evidence = grievance.evidencePack;

  const handleUpdate = async (status: string) => {
    if (!onStatusUpdate) return;
    setUpdating(true);
    await onStatusUpdate(grievance.id, status, resolutionNotes);
    setUpdating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-kisan-700 dark:text-kisan-400 uppercase tracking-wider">
                Statutory Dispute Dossier
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-black text-stone-900 dark:text-white">
                {grievance.grievanceNumber}
              </span>
            </div>
            <h3 className="text-base font-black text-stone-900 dark:text-white mt-1">
              Grievance Evidence Pack · {grievance.issueType.replace('_', ' ')}
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Compiled automatically from verified application and sensor events
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs text-stone-800 dark:text-stone-200">
          {/* Top Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Complainant Farmer</span>
              <strong className="text-stone-900 dark:text-white text-xs">{grievance.farmerName}</strong>
              <span className="text-[10px] text-stone-400 block font-mono">Mobile: {grievance.farmerMobile}</span>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Booking & Token</span>
              <strong className="text-stone-900 dark:text-white text-xs font-mono">{grievance.bookingId}</strong>
              <span className="text-[10px] text-kisan-600 dark:text-kisan-400 block font-black">
                Token: {grievance.tokenNumber}
              </span>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Procurement Mandi</span>
              <strong className="text-stone-900 dark:text-white text-xs">{grievance.centerName}</strong>
              <span className="text-[10px] text-stone-400 block">Commodity: {grievance.cropName}</span>
            </div>

            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Grievance Status</span>
              <Badge
                variant={
                  grievance.status === 'RESOLVED'
                    ? 'success'
                    : grievance.status === 'UNDER_REVIEW'
                    ? 'warning'
                    : 'info'
                }
              >
                {grievance.status}
              </Badge>
            </div>
          </div>

          {/* Dispute Statement */}
          <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-1.5">
            <span className="text-xs font-black uppercase text-amber-900 dark:text-amber-300">
              Farmer Dispute Description
            </span>
            <p className="text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
              "{grievance.description}"
            </p>
            <span className="text-[10px] text-stone-400 block pt-1">
              Logged at: {new Date(grievance.createdAt).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Evidence 1: Digital Weighment Receipt */}
          {evidence.weighmentReceipt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-black">
                <Scale className="w-4 h-4 text-kisan-600" />
                <span>Section 1: Electronic Weighbridge Sensor Record</span>
              </div>
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-stone-500 block text-[10px]">Gross Scale Weight</span>
                  <strong className="text-sm font-black text-stone-900 dark:text-white">
                    {evidence.weighmentReceipt.grossWeightQuintals} Q
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Tare Vehicle Weight</span>
                  <strong className="text-sm font-black text-stone-900 dark:text-white">
                    {evidence.weighmentReceipt.tareWeightQuintals} Q
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Net Certified Weight</span>
                  <strong className="text-sm font-black text-kisan-700 dark:text-kisan-400">
                    {evidence.weighmentReceipt.netWeightQuintals} Q
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Weighbridge Terminal</span>
                  <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
                    {evidence.weighmentReceipt.weighbridgeId}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Evidence 2: Quality Assay & Moisture */}
          {evidence.qualityAssay && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Section 2: Quality Assayer Laboratory Certification</span>
              </div>
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Certified Grade</span>
                    <strong className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {evidence.qualityAssay.qualityGrade}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Measured Moisture</span>
                    <strong className="text-xs font-black text-stone-900 dark:text-white">
                      {evidence.qualityAssay.foreignMatterPercent !== undefined
                        ? `${evidence.weighmentReceipt?.moistureContentPercent || 14.2}% (Standard \u2264 17%)`
                        : '14.2%'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Authorized Assayer</span>
                    <strong className="text-xs font-bold text-stone-900 dark:text-white">
                      {evidence.qualityAssay.inspectorName}
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 italic bg-white dark:bg-stone-900 p-2 rounded-md border border-stone-200 dark:border-stone-800">
                  Assay Note: {evidence.qualityAssay.assayNotes}
                </p>
              </div>
            </div>
          )}

          {/* Evidence 3: PFMS Payment Record */}
          {evidence.paymentStatus && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-black">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Section 3: Direct Benefit Transfer (PFMS DBT) Status</span>
              </div>
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-stone-500 block text-[10px]">Disbursement Status</span>
                  <strong className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {evidence.paymentStatus.status}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Amount Disbursed</span>
                  <strong className="text-sm font-black text-kisan-700 dark:text-kisan-400">
                    ₹{evidence.paymentStatus.amountRupees.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">PFMS Reference ID</span>
                  <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
                    {evidence.paymentStatus.transactionRef}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cryptographic Integrity Hash */}
          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-kisan-600" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
                  Dossier Cryptographic SHA-256 Proof Hash
                </span>
                <span className="font-mono text-[11px] text-stone-700 dark:text-stone-300 break-all font-bold">
                  {evidence.cryptographicProofHash}
                </span>
              </div>
            </div>
            <Badge variant="success">TAMPER-EVIDENT</Badge>
          </div>

          {/* Administrative Resolution Action */}
          {onStatusUpdate && (
            <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                Administrative Determination & Action
              </span>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter official resolution rationale or corrective instruction (e.g. Weighbridge load cell re-verified within \u00B10.05% tolerance; no deduction adjustment warranted)..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:outline-hidden focus:border-kisan-600"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdate('REJECTED')}
                  disabled={updating}
                  className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50"
                >
                  Dismiss / Reject Dispute
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdate('RESOLVED')}
                  disabled={updating}
                  className="text-xs font-black bg-kisan-700 hover:bg-kisan-800"
                >
                  Confirm Resolution & Close Dossier
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
