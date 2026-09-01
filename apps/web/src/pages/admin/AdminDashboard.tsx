import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  Clock,
  Download,
  AlertTriangle,
  Scale,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ApiClient } from '../../services/api';
import { useI18n } from '../../i18n/i18nContext';

const COLORS = ['#366c43', '#d97706', '#2563eb', '#7c3aed'];

export const AdminDashboard: React.FC = () => {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [district, setDistrict] = useState('Balasore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin login in background
    ApiClient.demoLogin('DISTRICT_ADMIN')
      .then(() => fetchMetrics(district))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [district]);

  const fetchMetrics = async (dist: string) => {
    try {
      const res = await ApiClient.getAdminAnalytics(dist);
      if (res.data) setMetrics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportReport = async () => {
    try {
      const res = await ApiClient.getAdminAnalytics(district);
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `kisan-pehele-report-${district}-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert('Report export failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {t('admin.title')}
            </h1>
            <Badge variant="active">District Administration</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            {t('admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="text-xs font-bold px-3.5 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-kisan-500"
          >
            <option value="Balasore">Balasore District</option>
            <option value="Cuttack">Cuttack District</option>
            <option value="Sambalpur">Sambalpur District</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            className="font-bold border-stone-300 dark:border-stone-700"
            onClick={handleExportReport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {t('admin.export_btn')}
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="p-4">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('admin.active_centers')}
          </span>
          <span className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-0.5 block">
            {metrics?.summary?.activeCenters ?? 4} / {metrics?.summary?.totalCenters ?? 4}
          </span>
          <span className="text-xs text-green-700 dark:text-green-400 font-bold block mt-1">
            {t('admin.operational_100')}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('officer.total_tokens')}
          </span>
          <span className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-0.5 block">
            {metrics?.summary?.totalTokensToday ?? 142}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block mt-1">
            {t('admin.district_wide')}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('admin.avg_wait')}
          </span>
          <span className="text-2xl font-black text-kisan-800 dark:text-kisan-300 font-mono mt-0.5 block">
            ~{metrics?.summary?.avgWaitMinutes ?? 28}m
          </span>
          <span className="text-xs text-kisan-700 dark:text-kisan-400 font-bold block mt-1">
            {t('admin.target_wait')}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('admin.total_procured')}
          </span>
          <span className="text-2xl font-black text-stone-900 dark:text-white font-mono mt-0.5 block">
            {metrics?.summary?.totalProcuredQuintals ?? 872.5} Q
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block mt-1">
            {t('admin.standard_grade')}
          </span>
        </Card>

        <Card className="p-4 col-span-2 sm:col-span-1">
          <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
            {t('admin.dbt_disbursed')}
          </span>
          <span className="text-xl sm:text-2xl font-black text-green-700 dark:text-green-400 font-mono mt-0.5 block truncate">
            ₹{((metrics?.summary?.totalDbtDisbursedRupees || 1904667) / 100000).toFixed(2)} L
          </span>
          <span className="text-xs text-green-700 dark:text-green-400 font-bold block mt-1">
            {t('admin.direct_to_bank')}
          </span>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Hourly Inflow vs Completed Throughput */}
        <Card variant="default" className="p-5 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-kisan-700 dark:text-kisan-400" />
              <span>{t('admin.chart_inflow_title')}</span>
            </h3>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              {t('admin.live_today')}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.hourlyTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="arrivals" name={t('admin.chart_arrivals')} fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name={t('admin.chart_completed')} fill="#366c43" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Crop-wise Distribution */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="font-black text-sm text-stone-900 dark:text-white">
              {t('admin.chart_crop_title')}
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics?.cropDistribution || []}
                  dataKey="quintals"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percentage }) => `${name.split(' ')[0]} ${percentage}%`}
                >
                  {(metrics?.cropDistribution || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Center Utilization & Bottleneck Table */}
      <Card variant="default" className="overflow-hidden">
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 flex items-center justify-between">
          <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span>{t('admin.table_heading')}</span>
          </h3>
          <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-bold">
            {t('admin.active_centers_count', { count: metrics?.centerUtilization?.length || 4 })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 font-black text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{t('admin.col_center_name')}</th>
                <th className="py-3.5 px-4">{t('admin.col_status')}</th>
                <th className="py-3.5 px-4">{t('admin.col_counters')}</th>
                <th className="py-3.5 px-4">{t('admin.col_tokens')}</th>
                <th className="py-3.5 px-4">{t('admin.col_avg_wait')}</th>
                <th className="py-3.5 px-4">{t('admin.col_utilization')}</th>
                <th className="py-3.5 px-4 text-right">{t('admin.col_efficiency')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {metrics?.centerUtilization?.map((c: any) => (
                <tr key={c.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-stone-900 dark:text-white">
                    {c.name}
                    <span className="block text-[10px] text-stone-500 dark:text-stone-400 font-mono font-semibold">{c.code}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.status === 'ACTIVE' ? 'active' : 'limited'}>{c.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-stone-800 dark:text-stone-200 font-semibold">
                    {c.activeCounters} {t('admin.unit_counters')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900 dark:text-white">
                    {c.tokensToday} {t('admin.unit_tokens')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-kisan-800 dark:text-kisan-300">
                    ~{c.currentWaitMinutes}m
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-28 bg-stone-200 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          c.utilizationPercent > 85 ? 'bg-red-500' : 'bg-kisan-600'
                        }`}
                        style={{ width: `${Math.min(100, c.utilizationPercent)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 font-mono font-bold mt-0.5 block">
                      {c.utilizationPercent}{t('admin.unit_utilized')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {c.isBottleneck ? (
                      <span className="text-red-700 dark:text-red-400 font-black inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {t('admin.bottleneck_warning')}
                      </span>
                    ) : (
                      <span className="text-green-700 dark:text-green-400 font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('admin.optimal_status')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
