import React, { useState, useEffect } from 'react';
import {
  Users,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Scale,
  FileCheck,
  CreditCard,
  Settings,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ApiClient } from '../../services/api';
import { socketService } from '../../services/socket';
import { useI18n } from '../../i18n/i18nContext';

export const OfficerConsole: React.FC = () => {
  const { t } = useI18n();
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [centerData, setCenterData] = useState<any | null>(null);
  const [queueData, setQueueData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [statusReason, setStatusReason] = useState('');
  const [activeCounters, setActiveCounters] = useState(3);

  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<any | null>(null);
  const [moisturePercent, setMoisturePercent] = useState<number>(14.2);
  const [foreignMatter, setForeignMatter] = useState<number>(0.6);
  const [qualityGrade, setQualityGrade] = useState<string>('GRADE_A');
  const [weighedWeight, setWeighedWeight] = useState<number>(25.0);
  const [inspectionNotes, setInspectionNotes] = useState<string>('');
  const [isAccepted, setIsAccepted] = useState<boolean>(true);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  useEffect(() => {
    // Demo officer login in background
    ApiClient.demoLogin('OFFICER')
      .then(() => ApiClient.getCenters())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCenters(res.data);
          const firstId = res.data[0].id;
          setSelectedCenterId(firstId);
          loadCenterQueue(firstId);
          socketService.joinCenter(firstId);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Listen to real-time events
    socketService.onQueueUpdated((data) => {
      setQueueData(data);
    });

    socketService.onProcurementChanged(() => {
      if (selectedCenterId) loadCenterQueue(selectedCenterId);
    });
  }, []);

  const loadCenterQueue = async (centerId: string) => {
    try {
      const [cRes, qRes] = await Promise.all([
        ApiClient.getCenterById(centerId),
        ApiClient.getQueue(centerId),
      ]);
      if (cRes.data) {
        setCenterData(cRes.data);
        setNewStatus(cRes.data.currentStatus);
        setActiveCounters(cRes.data.activeCounters);
      }
      if (qRes.data) {
        setQueueData(qRes.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdvanceQueue = async () => {
    if (!selectedCenterId) return;
    setIsProcessingAction(true);
    try {
      await ApiClient.advanceQueue(selectedCenterId);
      loadCenterQueue(selectedCenterId);
    } catch (err: any) {
      alert(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleUpdateCenterStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingAction(true);
    try {
      await ApiClient.updateCenterStatus(selectedCenterId, newStatus, statusReason, activeCounters);
      setIsStatusModalOpen(false);
      loadCenterQueue(selectedCenterId);
    } catch (err: any) {
      alert(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const openInspectionModal = (tokenItem: any) => {
    if (!tokenItem.caseId) return;
    ApiClient.getProcurementCaseById(tokenItem.caseId).then((res) => {
      if (res.data) {
        setActiveCase(res.data);
        setWeighedWeight(tokenItem.quantity || 25);
        setIsInspectModalOpen(true);
      }
    });
  };

  const handleVerify = async (caseId: string) => {
    setIsProcessingAction(true);
    try {
      await ApiClient.verifyFarmer(caseId, {
        verificationNotes: 'Aadhaar, KCC and Land Record physically verified.',
        farmerPhotoVerified: true,
        landRecordMatched: true,
      });
      loadCenterQueue(selectedCenterId);
    } catch (err: any) {
      alert(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleSubmitInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    setIsProcessingAction(true);
    try {
      await ApiClient.inspectCrop(activeCase.id, {
        measuredMoisturePercent: moisturePercent,
        foreignMatterPercent: foreignMatter,
        qualityGrade,
        weighedQuantityQuintals: weighedWeight,
        inspectionNotes: inspectionNotes || 'Standard grain sample tested on-site.',
        isAccepted,
      });
      setIsInspectModalOpen(false);
      loadCenterQueue(selectedCenterId);
    } catch (err: any) {
      alert(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleProcessPayment = async (caseId: string) => {
    setIsProcessingAction(true);
    try {
      await ApiClient.processPayment(caseId);
      loadCenterQueue(selectedCenterId);
    } catch (err: any) {
      alert(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Officer Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {t('officer.title')}
            </h1>
            <Badge variant="active">Live Mandi Operations</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('officer.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCenterId}
            onChange={(e) => {
              setSelectedCenterId(e.target.value);
              loadCenterQueue(e.target.value);
              socketService.joinCenter(e.target.value);
            }}
            className="text-xs font-bold px-3.5 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-kisan-500"
          >
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            className="font-bold border-stone-300 dark:border-stone-700"
            onClick={() => setIsStatusModalOpen(true)}
            leftIcon={<Settings className="w-4 h-4" />}
          >
            {t('officer.settings_btn')}
          </Button>
        </div>
      </div>

      {/* Operational KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('officer.total_tokens')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-mono mt-0.5 block">
            {queueData?.totalIssuedToday ?? 0}
          </span>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('officer.waiting')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 font-mono mt-0.5 block">
            {queueData?.activeQueueCount ?? 0}
          </span>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('officer.counters')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-kisan-800 dark:text-kisan-300 font-mono mt-0.5 block">
            {centerData?.activeCounters ?? 3}
          </span>
        </Card>

        <Card className="p-4 text-center">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('status.completed')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-green-700 dark:text-green-400 font-mono mt-0.5 block">
            {queueData?.completedCount ?? 0}
          </span>
        </Card>
      </div>

      {/* Active Serving Token & Call Next Banner */}
      <Card variant="accent" className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-kisan-600 text-white flex flex-col items-center justify-center font-mono shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-widest text-kisan-200">{t('farmer.token')}</span>
            <span className="text-2xl font-black">{queueData?.currentlyServing?.tokenNumber || 'A-102'}</span>
          </div>

          <div className="space-y-0.5 text-xs">
            <div className="font-black text-stone-900 dark:text-white text-base">
              {queueData?.currentlyServing?.farmerName || 'Suresh Jena'}
            </div>
            <div className="text-stone-700 dark:text-stone-300 font-medium">
              {queueData?.currentlyServing?.cropName || 'Paddy'} • {queueData?.currentlyServing?.quantity || 22.5} Q
            </div>
            <div className="text-green-800 dark:text-green-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{t('officer.active_serving')}</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="font-bold shadow-sm"
          isLoading={isProcessingAction}
          onClick={handleAdvanceQueue}
          leftIcon={<Play className="w-5 h-5 fill-white" />}
        >
          {t('officer.advance_queue')}
        </Button>
      </Card>

      {/* Live Queue Management Table */}
      <Card variant="default" className="overflow-hidden">
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 flex items-center justify-between">
          <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span>{t('officer.incoming_queue')}</span>
          </h3>
          <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-bold">
            {queueData?.queue?.length || 0} {t('farmer.farmers')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{t('farmer.token')}</th>
                <th className="py-3.5 px-4">{t('auth.farmer_name')}</th>
                <th className="py-3.5 px-4">{t('token.crop')} & {t('token.quantity')}</th>
                <th className="py-3.5 px-4">{t('farmer.arrive_at')}</th>
                <th className="py-3.5 px-4">{t('token.case_id')}</th>
                <th className="py-3.5 px-4 text-right">{t('common.view')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {queueData?.queue?.map((item: any) => (
                <tr key={item.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-stone-900 dark:text-white text-sm">
                    {item.tokenNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                    {item.farmerName}
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300 font-medium">
                    {item.cropName} • <strong className="text-stone-900 dark:text-white">{item.quantity} Q</strong>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold">
                    {item.slotTime || item.recommendedArrival}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        item.procurementStatus === 'PAID' || item.procurementStatus === 'ACCEPTED'
                          ? 'success'
                          : item.procurementStatus === 'INSPECTION'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {t(`status.${(item.procurementStatus || item.status || '').toLowerCase()}` as any) || (item.procurementStatus || item.status)}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {/* Action 1: Arrive / Verify */}
                    {item.procurementStatus === 'SCHEDULED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="font-bold"
                        onClick={() => ApiClient.markArrived(item.caseId).then(() => loadCenterQueue(selectedCenterId))}
                      >
                        {t('status.arrived')}
                      </Button>
                    )}

                    {item.procurementStatus === 'ARRIVED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="font-bold"
                        onClick={() => handleVerify(item.caseId)}
                      >
                        {t('officer.verify_farmer')}
                      </Button>
                    )}

                    {/* Action 2: Inspect Crop */}
                    {item.procurementStatus === 'INSPECTION' && (
                      <Button
                        variant="voice"
                        size="sm"
                        className="font-bold"
                        onClick={() => openInspectionModal(item)}
                        leftIcon={<Scale className="w-3.5 h-3.5" />}
                      >
                        {t('officer.record_inspection')}
                      </Button>
                    )}

                    {/* Action 3: Process Payment */}
                    {item.procurementStatus === 'PROCUREMENT_COMPLETED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="font-bold"
                        onClick={() => handleProcessPayment(item.caseId)}
                        leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                      >
                        {t('officer.trigger_payment')}
                      </Button>
                    )}

                    {item.procurementStatus === 'PAID' && (
                      <span className="text-green-700 dark:text-green-400 font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {t('status.paid')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Crop Inspection Modal */}
      <Modal
        isOpen={isInspectModalOpen}
        onClose={() => setIsInspectModalOpen(false)}
        title={t('officer.modal_quality_title')}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitInspection} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-stone-100 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-300 dark:border-stone-800 text-stone-800 dark:text-stone-200">
            <div>{t('officer.modal_farmer')} <strong className="text-stone-900 dark:text-white">{activeCase?.farmer?.name}</strong></div>
            <div>{t('officer.modal_crop')} <strong className="text-stone-900 dark:text-white">{activeCase?.crop?.nameEn}</strong></div>
            <div>{t('officer.modal_msp_rate')} <strong className="text-stone-900 dark:text-white">₹{activeCase?.crop?.minSupportPrice}/Q</strong></div>
            <div>{t('officer.modal_case_id')} <strong className="font-mono text-stone-900 dark:text-white">{activeCase?.caseNumber}</strong></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('officer.modal_moisture_label')}
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
              />
            </div>

            <div>
              <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('officer.modal_foreign_matter')}
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={foreignMatter}
                onChange={(e) => setForeignMatter(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('officer.modal_quality_grade')}
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
              >
                <option value="GRADE_A">{t('officer.grade_a')}</option>
                <option value="FAQ_STANDARD">{t('officer.grade_faq')}</option>
                <option value="GRADE_B">{t('officer.grade_b')}</option>
                <option value="BELOW_STANDARD">{t('officer.grade_below')}</option>
              </select>
            </div>

            <div>
              <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                {t('officer.modal_net_weight')}
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weighedWeight}
                onChange={(e) => setWeighedWeight(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              {t('officer.modal_officer_notes')}
            </label>
            <input
              type="text"
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              placeholder={t('officer.modal_notes_placeholder')}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-kisan-500"
            />
          </div>

          <div className="p-3.5 bg-kisan-50 dark:bg-kisan-950/80 rounded-xl border border-kisan-300 dark:border-kisan-700 flex items-center justify-between text-kisan-950 dark:text-kisan-100">
            <span className="font-black text-xs">
              {t('officer.modal_estimated_payout')} ₹{(weighedWeight * (activeCase?.crop?.minSupportPrice || 2183)).toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="acceptReject"
                  checked={isAccepted}
                  onChange={() => setIsAccepted(true)}
                />
                <span>{t('officer.modal_accept')}</span>
              </label>
              <label className="flex items-center gap-1.5 font-bold text-red-700 dark:text-red-400 cursor-pointer ml-3">
                <input
                  type="radio"
                  name="acceptReject"
                  checked={!isAccepted}
                  onChange={() => setIsAccepted(false)}
                />
                <span>{t('officer.modal_reject')}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" className="font-bold" onClick={() => setIsInspectModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-bold" isLoading={isProcessingAction}>
              {t('officer.modal_save_complete')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Center Operational Settings Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={t('officer.modal_center_control_title')}
      >
        <form onSubmit={handleUpdateCenterStatus} className="space-y-4 text-xs">
          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              {t('officer.modal_center_status_label')}
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
            >
              <option value="ACTIVE">{t('admin.status_active')}</option>
              <option value="LIMITED_CAPACITY">{t('admin.status_limited')}</option>
              <option value="PAUSED">PAUSED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              {t('officer.modal_active_counters_label')}
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={activeCounters}
              onChange={(e) => setActiveCounters(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
            />
          </div>

          <div>
            <label className="block font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
              {t('officer.modal_reason_label')}
            </label>
            <textarea
              rows={3}
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder={t('officer.modal_reason_placeholder')}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-kisan-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" className="font-bold" onClick={() => setIsStatusModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-bold" isLoading={isProcessingAction}>
              {t('officer.modal_update_broadcast')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
