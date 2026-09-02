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
  SlidersHorizontal,
  Layers,
  FileText,
  ShieldCheck,
  Activity,
  ArrowRight,
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

// Intelligence Enhancement Components
import { BottleneckMonitor } from '../../components/intelligence/BottleneckMonitor';
import { WhatIfCapacitySimulator } from '../../components/intelligence/WhatIfCapacitySimulator';
import { NoShowIntelligenceCard } from '../../components/intelligence/NoShowIntelligenceCard';
import { QueueRebalancingCard } from '../../components/intelligence/QueueRebalancingCard';
import { GrievanceEvidencePackModal } from '../../components/intelligence/GrievanceEvidencePackModal';
import { AuditIntegrityViewer } from '../../components/intelligence/AuditIntegrityViewer';
import { CenterAdvancedDiagnosticsModal } from '../../components/intelligence/CenterAdvancedDiagnosticsModal';
import { GrievanceRecord } from '../../types/operationalIntelligence';

const COLORS = ['#366c43', '#d97706', '#2563eb', '#7c3aed'];

const DEFAULT_INITIAL_METRICS = {
  summary: {
    totalCenters: 4,
    activeCenters: 4,
    limitedCenters: 1,
    pausedOrClosed: 0,
    totalTokensToday: 142,
    totalServedToday: 118,
    totalProcuredQuintals: 872.5,
    totalDbtDisbursedRupees: 1905500,
    avgWaitMinutes: 28,
    bottlenecksCount: 1,
  },
  hourlyTrends: [
    { time: '08:00 AM', arrivals: 12, completed: 8 },
    { time: '09:00 AM', arrivals: 28, completed: 22 },
    { time: '10:00 AM', arrivals: 45, completed: 38 },
    { time: '11:00 AM', arrivals: 52, completed: 44 },
    { time: '12:00 PM', arrivals: 40, completed: 42 },
    { time: '01:00 PM', arrivals: 35, completed: 36 },
    { time: '02:00 PM', arrivals: 48, completed: 40 },
    { time: '03:00 PM', arrivals: 30, completed: 34 },
    { time: '04:00 PM', arrivals: 18, completed: 25 },
  ],
  cropDistribution: [
    { name: 'Paddy (Common)', quintals: 567.0, percentage: 65 },
    { name: 'Wheat (Grade A)', quintals: 174.5, percentage: 20 },
    { name: 'Ragi (Finger Millet)', quintals: 87.2, percentage: 10 },
    { name: 'Maize', quintals: 43.8, percentage: 5 },
  ],
  centerUtilization: [
    {
      id: 'c1',
      code: 'OD-BAL-001',
      name: 'Balasore RMC Central Mandi',
      district: 'Balasore',
      status: 'ACTIVE',
      activeCounters: 4,
      tokensToday: 54,
      completedToday: 42,
      procuredQuintals: 340.5,
      utilizationPercent: 68,
      currentWaitMinutes: 25,
      isBottleneck: false,
    },
    {
      id: 'c2',
      code: 'OD-BAL-002',
      name: 'Remuna Large Procurement Center',
      district: 'Balasore',
      status: 'ACTIVE',
      activeCounters: 3,
      tokensToday: 38,
      completedToday: 31,
      procuredQuintals: 235.0,
      utilizationPercent: 55,
      currentWaitMinutes: 20,
      isBottleneck: false,
    },
    {
      id: 'c3',
      code: 'OD-BAL-003',
      name: 'Basta Block Direct Purchase Depo',
      district: 'Balasore',
      status: 'LIMITED_CAPACITY',
      activeCounters: 2,
      tokensToday: 32,
      completedToday: 25,
      procuredQuintals: 187.0,
      utilizationPercent: 88,
      currentWaitMinutes: 52,
      isBottleneck: true,
    },
    {
      id: 'c4',
      code: 'OD-BAL-004',
      name: 'Jaleswar Border Mandi Terminal',
      district: 'Balasore',
      status: 'ACTIVE',
      activeCounters: 3,
      tokensToday: 18,
      completedToday: 20,
      procuredQuintals: 110.0,
      utilizationPercent: 42,
      currentWaitMinutes: 15,
      isBottleneck: false,
    },
  ],
};

type ActiveAdminTab = 'OVERVIEW' | 'BOTTLENECK' | 'SIMULATION' | 'NO_SHOW' | 'GRIEVANCE' | 'AUDIT';

export const AdminDashboard: React.FC = () => {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<any>(DEFAULT_INITIAL_METRICS);
  const [district, setDistrict] = useState('Balasore');
  const [activeTab, setActiveTab] = useState<ActiveAdminTab>('OVERVIEW');

  // Diagnostics Modal State
  const [selectedCenterForDiagnostics, setSelectedCenterForDiagnostics] = useState<any | null>(null);

  // Grievance State
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [selectedGrievanceForEvidence, setSelectedGrievanceForEvidence] = useState<GrievanceRecord | null>(null);

  useEffect(() => {
    fetchMetrics(district);
    fetchGrievances();
  }, [district]);

  const fetchMetrics = async (dist: string) => {
    try {
      const res = await ApiClient.getAdminAnalytics(dist);
      if (res && res.data) setMetrics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGrievances = async () => {
    try {
      const res = await ApiClient.getGrievances();
      if (res && res.data) setGrievances(res.data);
    } catch (e) {
      console.warn('Grievances fetch fallback:', e);
    }
  };

  const handleStatusUpdate = async (id: string, status: string, notes?: string) => {
    try {
      await ApiClient.updateGrievanceStatus(id, status, notes);
      fetchGrievances();
      if (selectedGrievanceForEvidence && selectedGrievanceForEvidence.id === id) {
        setSelectedGrievanceForEvidence({
          ...selectedGrievanceForEvidence,
          status: status as any,
          resolutionNotes: notes,
        });
      }
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
            <Badge variant="active">District Administration Intelligence</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
            Operational telemetry, bottleneck detection, capacity simulation & statutory transparency
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

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'OVERVIEW'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('BOTTLENECK')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'BOTTLENECK'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Bottlenecks & Rebalancing</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-black">1</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATION')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'SIMULATION'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Capacity Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('NO_SHOW')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'NO_SHOW'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>No-Show Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('GRIEVANCE')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'GRIEVANCE'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Disputes & Evidence</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-black">
            {grievances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'AUDIT'
              ? 'bg-kisan-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Integrity</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* KPI Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card className="p-4">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('admin.kpi_centers')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-stone-900 dark:text-white">
                  {metrics?.summary?.activeCenters}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400">/ {metrics?.summary?.totalCenters}</span>
              </div>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold block mt-1">
                {t('admin.all_districts_online')}
              </span>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('admin.kpi_tokens')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-stone-900 dark:text-white">
                  {metrics?.summary?.totalTokensToday}
                </span>
              </div>
              <span className="text-[10px] text-stone-600 dark:text-stone-400 font-bold block mt-1">
                {t('admin.tokens_cleared', { count: metrics?.summary?.totalServedToday })}
              </span>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('admin.kpi_procured')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-kisan-800 dark:text-kisan-300">
                  {metrics?.summary?.totalProcuredQuintals}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400">{t('admin.unit_quintals')}</span>
              </div>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold block mt-1">
                {t('admin.target_achieved')}
              </span>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('admin.kpi_dbt')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-amber-700 dark:text-amber-300">
                  ₹{(metrics?.summary?.totalDbtDisbursedRupees / 100000).toFixed(1)}L
                </span>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block mt-1">
                {t('admin.dbt_settled')}
              </span>
            </Card>

            <Card className="p-4 col-span-2 sm:col-span-1">
              <span className="text-xs font-black text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                {t('admin.kpi_avg_wait')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-stone-900 dark:text-white">
                  {metrics?.summary?.avgWaitMinutes}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400">{t('admin.unit_mins')}</span>
              </div>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold block mt-1">
                {t('admin.wait_reduced')}
              </span>
            </Card>
          </div>

          {/* Quick Intelligence Summary Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <strong className="text-xs font-black text-stone-900 dark:text-white block">
                  1 Procurement Centre Experiencing Bottleneck
                </strong>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                  Basta Block Depo: 48 in queue, estimated 72m wait time. Nearby Remuna Center has available capacity.
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setActiveTab('BOTTLENECK')}
              className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
            >
              Analyze & Rebalance Inflow
            </Button>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hourly Inflow Chart */}
            <Card variant="default" className="p-5 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <span>{t('admin.hourly_chart_title')}</span>
                </h3>
                <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                  {t('admin.peak_window')}
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.hourlyTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar dataKey="arrivals" fill="#366c43" name={t('admin.legend_arrivals')} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="#d97706" name={t('admin.legend_completed')} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Crop Distribution Donut */}
            <Card variant="default" className="p-5 space-y-4">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
                <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <span>{t('admin.crop_chart_title')}</span>
                </h3>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics?.cropDistribution || []}
                      dataKey="quintals"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {(metrics?.cropDistribution || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => `${val} ${t('admin.unit_quintals')}`}
                      contentStyle={{
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                {(metrics?.cropDistribution || []).map((c: any, i: number) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-bold text-stone-800 dark:text-stone-200">{c.name}</span>
                    </div>
                    <span className="font-mono text-stone-600 dark:text-stone-400 font-bold">{c.quintals} Q</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center Utilization & Bottleneck Table */}
          <Card variant="default" className="overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-stone-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <span>Procurement Centres — Real-time Status</span>
                </h3>
                <span className="text-[11px] text-stone-500">Click any centre to view Advanced Diagnostics</span>
              </div>
              <span className="text-xs text-stone-600 dark:text-stone-400 font-mono font-bold">
                {metrics?.centerUtilization?.length || 4} Centers
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
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {metrics?.centerUtilization?.map((c: any) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCenterForDiagnostics(c)}
                      className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-black text-stone-900 dark:text-white">
                        {c.name}
                        <span className="block text-[10px] text-stone-500 dark:text-stone-400 font-mono font-semibold">
                          {c.code}
                        </span>
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
                          {c.utilizationPercent}
                          {t('admin.unit_utilized')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCenterForDiagnostics(c);
                          }}
                          className="font-bold text-[11px]"
                        >
                          Diagnostics
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: BOTTLENECKS & REBALANCING */}
      {activeTab === 'BOTTLENECK' && (
        <div className="space-y-8">
          <BottleneckMonitor
            district={district}
            onSimulateCenter={() => setActiveTab('SIMULATION')}
            onRebalanceCenter={() => {}}
          />

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <QueueRebalancingCard />
          </div>
        </div>
      )}

      {/* TAB 3: CAPACITY SIMULATOR */}
      {activeTab === 'SIMULATION' && (
        <div>
          <WhatIfCapacitySimulator />
        </div>
      )}

      {/* TAB 4: NO-SHOW INTELLIGENCE */}
      {activeTab === 'NO_SHOW' && (
        <div>
          <NoShowIntelligenceCard />
        </div>
      )}

      {/* TAB 5: GRIEVANCES & EVIDENCE PACKS */}
      {activeTab === 'GRIEVANCE' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <h3 className="text-base font-black text-stone-900 dark:text-white">
                Farmer Dispute & Statutory Grievance Resolution
              </h3>
              <p className="text-xs text-stone-500">
                Official records of farmer issues with auto-assembled evidentiary proof packs.
              </p>
            </div>
            <Badge variant="warning">{grievances.length} Active Records</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {grievances.map((g) => (
              <Card key={g.id} className="p-5 border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-kisan-700 dark:text-kisan-400">
                        {g.grievanceNumber}
                      </span>
                      <strong className="text-sm font-black text-stone-900 dark:text-white">
                        {g.issueType.replace('_', ' ')}
                      </strong>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Farmer: <strong>{g.farmerName}</strong> ({g.farmerMobile}) · Token: <strong>{g.tokenNumber}</strong> · Mandi: <strong>{g.centerName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        g.status === 'RESOLVED'
                          ? 'success'
                          : g.status === 'UNDER_REVIEW'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {g.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedGrievanceForEvidence(g)}
                      className="text-xs font-bold"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1 text-kisan-700" />
                      View Evidence Pack
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 font-medium bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                  "{g.description}"
                </p>

                {g.resolutionNotes && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Resolution: {g.resolutionNotes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT INTEGRITY */}
      {activeTab === 'AUDIT' && (
        <div>
          <AuditIntegrityViewer />
        </div>
      )}

      {/* Advanced Diagnostics Drawer/Modal */}
      {selectedCenterForDiagnostics && (
        <CenterAdvancedDiagnosticsModal
          center={selectedCenterForDiagnostics}
          onClose={() => setSelectedCenterForDiagnostics(null)}
          onNavigateToTab={(tab) => {
            setActiveTab(tab as any);
            setSelectedCenterForDiagnostics(null);
          }}
        />
      )}

      {/* Grievance Evidence Pack Modal */}
      {selectedGrievanceForEvidence && (
        <GrievanceEvidencePackModal
          grievance={selectedGrievanceForEvidence}
          onClose={() => setSelectedGrievanceForEvidence(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};
