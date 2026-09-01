import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, RefreshCw, FileText, ArrowRight, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApiClient } from '../../services/api';
import { useI18n } from '../../i18n/i18nContext';

export const AuditorPortal: React.FC = () => {
  const { t } = useI18n();
  const [logs, setLogs] = useState<any[]>([]);
  const [entityFilter, setEntityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auditor login in background
    ApiClient.demoLogin('AUDITOR')
      .then(() => fetchLogs())
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getAuditLogs({
        entityName: entityFilter || undefined,
        actorRole: roleFilter || undefined,
      });
      if (res.data) setLogs(res.data);
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
            <Badge variant="neutral">Immutable Append-Only Trail</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('auditor.subtitle')}
          </p>
        </div>

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
  );
};
