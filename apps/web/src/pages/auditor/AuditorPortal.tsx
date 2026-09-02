import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, RefreshCw, FileText, ArrowRight, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApiClient } from '../../services/api';
import { useI18n } from '../../i18n/i18nContext';
import { AuditIntegrityViewer } from '../../components/intelligence/AuditIntegrityViewer';

const DEFAULT_AUDIT_LOGS = [
  {
    id: 'aud-001',
    actorId: 'usr_9876543230',
    actorRole: 'OFFICER',
    action: 'WEIGHMENT_RECORDED',
    entityName: 'ProcurementCase',
    entityId: 'case-od-bal-20260902-01',
    previousStateJson: JSON.stringify({ status: 'SERVING', grossWeightQuintals: 0 }),
    newStateJson: JSON.stringify({
      status: 'WEIGHED',
      grossWeightQuintals: 28.4,
      tareWeightQuintals: 3.4,
      netWeightQuintals: 25.0,
      crop: 'Paddy (Common)',
      moistureContentPercent: 14.2,
      weighbridgeId: 'WB-02',
    }),
    reason: 'Digital weighbridge gross-tare differential automated reading certified.',
    ipAddress: '10.0.4.12',
    userAgent: 'MandiConsole/2.1 (Balasore RMC)',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    actor: {
      id: 'usr_9876543230',
      name: 'Rajesh Kumar (Mandi Officer)',
      mobile: '9876543230',
      role: 'OFFICER',
    },
  },
  {
    id: 'aud-002',
    actorId: 'usr_9876543230',
    actorRole: 'OFFICER',
    action: 'QUALITY_ASSAY_APPROVED',
    entityName: 'ProcurementCase',
    entityId: 'case-od-bal-20260902-01',
    previousStateJson: JSON.stringify({ qualityGrade: 'PENDING' }),
    newStateJson: JSON.stringify({
      qualityGrade: 'FAQ_GRADE_A',
      foreignMatterPercent: 0.8,
      damagedGrainsPercent: 1.2,
      approvedMspRatePerQuintal: 2183,
    }),
    reason: 'FSSAI/FAQ compliant lab assay test completed by Quality Inspector.',
    ipAddress: '10.0.4.12',
    userAgent: 'MandiConsole/2.1 (Balasore RMC)',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    actor: {
      id: 'usr_9876543230',
      name: 'Rajesh Kumar (Mandi Officer)',
      mobile: '9876543230',
      role: 'OFFICER',
    },
  },
  {
    id: 'aud-003',
    actorId: 'usr_9876543240',
    actorRole: 'DISTRICT_ADMIN',
    action: 'CAPACITY_OVERRIDE_APPROVED',
    entityName: 'ProcurementCenter',
    entityId: 'c3',
    previousStateJson: JSON.stringify({ dailySlotCapacity: 250, currentStatus: 'LIMITED_CAPACITY' }),
    newStateJson: JSON.stringify({ dailySlotCapacity: 350, currentStatus: 'ACTIVE', extraCounters: 1 }),
    reason: 'Heavy rain forecasted; expanded Basta Depo capacity to prevent farmer distress.',
    ipAddress: '192.168.1.105',
    userAgent: 'AdminPortal/1.0 (District Collectorate)',
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    actor: {
      id: 'usr_9876543240',
      name: 'Dr. Alok Verma (District Collector)',
      mobile: '9876543240',
      role: 'DISTRICT_ADMIN',
    },
  },
  {
    id: 'aud-004',
    actorId: 'usr_9876543210',
    actorRole: 'FARMER',
    action: 'BOOKING_CREATED',
    entityName: 'Booking',
    entityId: 'bk-20260902-102',
    previousStateJson: null,
    newStateJson: JSON.stringify({
      centerId: 'c1',
      crop: 'Paddy',
      slotTime: '09:00 AM - 09:20 AM',
      tokenNumber: 'A-102',
      estimatedQuantityQuintals: 25,
    }),
    reason: 'Farmer self-scheduled procurement slot before departure.',
    ipAddress: '49.36.128.4',
    userAgent: 'KisanPeheleMobileWeb/1.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    actor: {
      id: 'usr_9876543210',
      name: 'Ramesh Patel',
      mobile: '9876543210',
      role: 'FARMER',
    },
  },
  {
    id: 'aud-005',
    actorId: 'usr_9876543210',
    actorRole: 'FARMER',
    action: 'HELPER_AUTHORIZED',
    entityName: 'TrustedHelper',
    entityId: 'th-20260902-01',
    previousStateJson: null,
    newStateJson: JSON.stringify({
      helperName: 'Karan Patel',
      helperMobile: '9876543220',
      relationship: 'Son',
      permissions: 'VIEW_AND_BOOK',
    }),
    reason: 'Farmer delegated transport & slot coordination to trusted family member.',
    ipAddress: '49.36.128.4',
    userAgent: 'KisanPeheleMobileWeb/1.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    actor: {
      id: 'usr_9876543210',
      name: 'Ramesh Patel',
      mobile: '9876543210',
      role: 'FARMER',
    },
  },
  {
    id: 'aud-006',
    actorId: 'sys_pfms_gateway',
    actorRole: 'SYSTEM',
    action: 'DBT_DISBURSEMENT_INITIATED',
    entityName: 'ProcurementCase',
    entityId: 'case-od-bal-20260902-01',
    previousStateJson: JSON.stringify({ dbtStatus: 'PENDING', amountRupees: 0 }),
    newStateJson: JSON.stringify({
      dbtStatus: 'INITIATED',
      amountRupees: 54575,
      beneficiaryAadhaarHash: 'e3b0c44298fc1c149afbf4c8996fb924',
      pfmsBatchId: 'PFMS-OD-BAL-20260902-991',
    }),
    reason: 'Automated PFMS electronic direct benefit transfer triggered upon FAQ approval.',
    ipAddress: '10.0.0.1',
    userAgent: 'PFMS-IntegrationService/1.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
    actor: {
      id: 'sys_pfms_gateway',
      name: 'PFMS Automated Core Gateway',
      mobile: '1800118005',
      role: 'SYSTEM',
    },
  },
];

export const AuditorPortal: React.FC = () => {
  const { t } = useI18n();
  const [logs, setLogs] = useState<any[]>(DEFAULT_AUDIT_LOGS);
  const [entityFilter, setEntityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'CHAIN' | 'STREAM'>('CHAIN');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getAuditLogs({
        entityName: entityFilter || undefined,
        actorRole: roleFilter || undefined,
      });
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {t('auditor.title')}
            </h1>
            <Badge variant="neutral">Tamper-Evident Statutory Audit Trail</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('auditor.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="font-bold border-stone-300 dark:border-stone-700"
            onClick={fetchLogs}
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            {t('auditor.refresh_btn')}
          </Button>
        </div>
      </div>

      {/* View Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveView('CHAIN')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeView === 'CHAIN'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          🔒 Cryptographic Hash-Chain Verification
        </button>

        <button
          onClick={() => setActiveView('STREAM')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeView === 'STREAM'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          📋 Raw Statutory Event Log Stream ({logs.length})
        </button>
      </div>

      {activeView === 'CHAIN' ? (
        <AuditIntegrityViewer />
      ) : (
        <div className="space-y-6">

      {/* Filters */}
      <Card variant="default" className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">{t('auditor.entity_filter')}</label>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
          >
            <option value="">{t('center.all_statuses')}</option>
            <option value="ProcurementCase">ProcurementCase</option>
            <option value="ProcurementCenter">ProcurementCenter</option>
            <option value="Booking">Booking</option>
            <option value="Token">Token</option>
            <option value="TrustedHelper">TrustedHelper</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">{t('auditor.role_filter')}</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-kisan-500"
          >
            <option value="">All Roles</option>
            <option value="OFFICER">OFFICER</option>
            <option value="DISTRICT_ADMIN">DISTRICT_ADMIN</option>
            <option value="FARMER">FARMER</option>
            <option value="SYSTEM">SYSTEM</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button variant="primary" size="md" className="w-full font-bold" onClick={fetchLogs}>
            {t('auditor.apply_filter')}
          </Button>
        </div>
      </Card>

      {/* Audit Log Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-stone-500 dark:text-stone-400 text-sm font-medium">{t('common.loading')}</div>
        ) : logs.length === 0 ? (
          <Card className="p-8 text-center text-stone-600 dark:text-stone-400 text-sm font-medium">{t('common.no_data')}</Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} variant="default" className="p-4 space-y-2.5 text-xs hover:border-stone-400 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-kisan-950 dark:text-kisan-200 bg-kisan-100 dark:bg-kisan-950 px-2.5 py-0.5 rounded border border-kisan-300 dark:border-kisan-700">
                    {log.action}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">•</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {log.entityName} #{log.entityId?.substring(0, 12)}
                  </span>
                </div>

                <div className="text-stone-500 dark:text-stone-400 text-xs font-mono font-medium">
                  {new Date(log.createdAt).toLocaleString()} • IP: {log.ipAddress}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-800 dark:text-stone-200">
                <div>
                  <span className="text-stone-600 dark:text-stone-400 block text-xs uppercase font-black">{t('auditor.actor_label')}</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {log.actor?.name || 'Authorized System Actor'} ({log.actorRole})
                  </span>
                </div>

                <div>
                  <span className="text-stone-600 dark:text-stone-400 block text-xs uppercase font-black">{t('auditor.reason_label')}</span>
                  <span className="text-stone-800 dark:text-stone-200 italic font-medium">
                    “{log.reason || 'Standard operational transition executed'}”
                  </span>
                </div>
              </div>

              {/* State Transition Diff view if JSON is present */}
              {(log.previousStateJson || log.newStateJson) && (
                <div className="bg-stone-100 dark:bg-stone-950 p-2.5 rounded-lg border border-stone-300 dark:border-stone-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex-1 overflow-x-auto text-stone-600 dark:text-stone-400">
                    <strong className="text-stone-900 dark:text-white">Prev:</strong> {log.previousStateJson || 'null'}
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 dark:text-stone-400 flex-shrink-0 hidden sm:block" />
                  <div className="flex-1 overflow-x-auto text-kisan-900 dark:text-kisan-200 font-bold">
                    <strong className="text-stone-900 dark:text-white">New:</strong> {log.newStateJson || 'null'}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
      )}
    </div>
  );
};
