import React, { useState, useMemo } from 'react';
import { 
  CropDisease, 
  ScanHistoryEntry, 
  BayesCalculation,
  Language
} from '../types';
import { 
  getScanHistory, 
  saveScanHistory, 
  deleteScanHistoryItem, 
  updateScanHistoryItem, 
  resetScanHistoryToDefault 
} from '../utils/scanHistory';
import { SeasonalPlantingCard } from './SeasonalPlantingCard';
import { ClimateSmartWeatherCard } from './ClimateSmartWeatherCard';
import { t, translateCrop, translateSeverity, translateStatus } from '../utils/translations';
import { 
  Camera, 
  LayoutGrid, 
  ListFilter, 
  Search, 
  Trash2, 
  Download, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Sprout, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Stethoscope, 
  CloudSun, 
  MessageSquare,
  FileSpreadsheet,
  Plus
} from 'lucide-react';

interface DashboardProps {
  onScanNewLeaf: () => void;
  onOpenInScanner: (crop: CropDisease) => void;
  onSendToBayes: (crop: CropDisease) => void;
  onConsultAgronomist: (crop: CropDisease) => void;
  language?: Language;
  onAskPlantingQuestion?: (query: string) => void;
  onSendToBayesWithWeather?: (weather: { temperature: number; humidity: number; rainfall: number; windSpeed: number }) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onScanNewLeaf,
  onOpenInScanner,
  onSendToBayes,
  onConsultAgronomist,
  language = 'en',
  onAskPlantingQuestion,
  onSendToBayesWithWeather
}) => {
  const [history, setHistory] = useState<ScanHistoryEntry[]>(() => getScanHistory());
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [cropFilter, setCropFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Re-sync with localStorage
  const refreshHistory = () => {
    setHistory(getScanHistory());
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = deleteScanHistoryItem(id);
    setHistory(updated);
  };

  const handleStatusChange = (id: string, newStatus: ScanHistoryEntry['status']) => {
    const updated = updateScanHistoryItem(id, { status: newStatus });
    setHistory(updated);
  };

  const handleReset = () => {
    if (window.confirm('Reset scan history back to default sample field records?')) {
      const reset = resetScanHistoryToDefault();
      setHistory(reset);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Scan ID', 'Timestamp', 'Crop', 'Disease Detected', 'Pathogen', 'Severity', 'Confidence (%)', 'Field Zone', 'Status', 'Notes'];
    const rows = history.map(item => [
      `"${item.id}"`,
      `"${item.timestamp}"`,
      `"${item.cropName}"`,
      `"${item.disease.name}"`,
      `"${item.disease.pathogenType}"`,
      `"${item.severity}"`,
      item.confidence,
      `"${item.fieldZone || 'N/A'}"`,
      `"${item.status}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cropguard-scan-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered entries
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = 
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.fieldZone && item.fieldZone.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSeverity = 
        severityFilter === 'All' ? true :
        severityFilter === 'High' ? (item.severity === 'High' || item.severity === 'Critical') :
        severityFilter === 'Moderate' ? (item.severity === 'Moderate' || item.severity === 'Low') :
        item.severity === 'Healthy';

      const matchesCrop = 
        cropFilter === 'All' ? true :
        item.cropName.toLowerCase().includes(cropFilter.toLowerCase());

      const matchesStatus = 
        statusFilter === 'All' ? true :
        item.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesCrop && matchesStatus;
    });
  }, [history, searchQuery, severityFilter, cropFilter, statusFilter]);

  // Summary Metrics
  const totalScans = history.length;
  const criticalCount = history.filter(h => h.severity === 'Critical' || h.severity === 'High').length;
  const healthyCount = history.filter(h => h.severity === 'Healthy').length;
  const treatmentAppliedCount = history.filter(h => h.status === 'Treatment Applied' || h.status === 'Resolved').length;

  const severityBadgeClass = (severity: CropDisease['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Healthy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const statusBadgeClass = (status: ScanHistoryEntry['status']) => {
    switch (status) {
      case 'High Risk Alert':
        return 'bg-red-50 text-red-700 border-red-300';
      case 'Under Observation':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Treatment Applied':
        return 'bg-indigo-50 text-indigo-700 border-indigo-300';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI Stat Cards */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                {t('dashboard.archiveBadge', language)}
              </span>
              <span className="text-xs text-slate-500">{t('dashboard.recordsSubtitle', language)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk'] tracking-tight">
              {t('dashboard.title', language)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t('dashboard.subtitle', language)}
            </p>
          </div>

          {/* Quick Action Button to Scanner */}
          <div className="flex items-center gap-2">
            <button
              onClick={onScanNewLeaf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t('dashboard.scanNewLeafBtn', language)}</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              title="Download History CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">{t('common.export', language)}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-5">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard.totalScans', language)}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-mono">{totalScans}</span>
              <span className="text-xs text-slate-500">{language === 'so' ? 'diwaanno' : 'records'}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2 font-medium">
              <Sprout className="w-3 h-3" />
              <span>{t('dashboard.monitoredPlots', language)}</span>
            </div>
          </div>

          <div className="bg-rose-50/70 rounded-xl p-3.5 border border-rose-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">{t('dashboard.highRisk', language)}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-rose-900 font-mono">{criticalCount}</span>
              <span className="text-xs text-rose-600">{language === 'so' ? 'digniino' : 'active alerts'}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-700 mt-2 font-medium">
              <AlertTriangle className="w-3 h-3" />
              <span>{t('dashboard.immediateAction', language)}</span>
            </div>
          </div>

          <div className="bg-indigo-50/70 rounded-xl p-3.5 border border-indigo-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">{t('dashboard.interventions', language)}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-indigo-900 font-mono">{treatmentAppliedCount}</span>
              <span className="text-xs text-indigo-600">{language === 'so' ? 'la daweeyay' : 'treated / safe'}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-indigo-700 mt-2 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t('dashboard.organicRemedies', language)}</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/80 flex flex-col">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">{t('dashboard.healthyFoliage', language)}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-900 font-mono">{healthyCount}</span>
              <span className="text-xs text-emerald-700">
                ({totalScans > 0 ? ((healthyCount / totalScans) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-2 font-medium">
              <Sparkles className="w-3 h-3" />
              <span>{t('dashboard.chlorophyllVigor', language)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Agrometeorological Weather & Climate-Smart Advisory Card */}
      <ClimateSmartWeatherCard 
        language={language}
        onSendToBayesWithWeather={onSendToBayesWithWeather}
        onAskWeatherQuestion={onAskPlantingQuestion}
      />

      {/* Suggested Seasonal Planting Tips & Rotation Guide (Based on Month & User Scan History) */}
      <SeasonalPlantingCard 
        history={history}
        language={language}
        onConsultAgronomist={onConsultAgronomist}
        onAskPlantingQuestion={onAskPlantingQuestion}
      />

      {/* Filter and View Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'so' ? 'Raadi dalagga, cudurka, astaamaha, ama beerta...' : 'Search crop, disease name, symptoms, or plot...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Crop Filter */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">{language === 'so' ? 'Dhammaan Dalagyada' : 'All Crops'}</option>
            <option value="Tomato">{language === 'so' ? 'Yaanyo (Tomato)' : 'Tomato'}</option>
            <option value="Maize">{language === 'so' ? 'Galley (Maize)' : 'Maize (Corn)'}</option>
            <option value="Cassava">{language === 'so' ? 'Kasaafada (Cassava)' : 'Cassava'}</option>
            <option value="Potato">{language === 'so' ? 'Baradho (Potato)' : 'Potato'}</option>
            <option value="Banana">{language === 'so' ? 'Muus (Banana)' : 'Banana'}</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">{language === 'so' ? 'Dhammaan Halista' : 'All Severities'}</option>
            <option value="High">{language === 'so' ? 'Sareeya / Halis' : 'High / Critical'}</option>
            <option value="Moderate">{language === 'so' ? 'Dhexdhexaad / Hooseeya' : 'Moderate / Low'}</option>
            <option value="Healthy">{language === 'so' ? 'Caafimaad qaba' : 'Healthy'}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="All">{language === 'so' ? 'Dhammaan Xaaladaha' : 'All Statuses'}</option>
            <option value="Under Observation">{language === 'so' ? 'Kormeer ku Jira' : 'Under Observation'}</option>
            <option value="Treatment Applied">{language === 'so' ? 'Dawo La Mariyay' : 'Treatment Applied'}</option>
            <option value="Resolved">{language === 'so' ? 'Waa Xallismay' : 'Resolved'}</option>
            <option value="High Risk Alert">{language === 'so' ? 'Digniin Halis ah' : 'High Risk Alert'}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table List View"
            >
              <ListFilter className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Demo Samples Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            title={language === 'so' ? 'Dib ugu celi tusaalooyinkii hore' : 'Reset to default sample scan records'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Filter Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          {language === 'so' ? (
            <>Waxaa muuqda <strong>{filteredHistory.length}</strong> oo ka mid ah <strong>{history.length}</strong> baaritaan hore</>
          ) : (
            <>Showing <strong>{filteredHistory.length}</strong> of <strong>{history.length}</strong> historical scan findings</>
          )}
        </span>
        {(searchQuery || severityFilter !== 'All' || cropFilter !== 'All' || statusFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSeverityFilter('All');
              setCropFilter('All');
              setStatusFilter('All');
            }}
            className="text-emerald-700 hover:underline font-medium cursor-pointer"
          >
            {language === 'so' ? 'Dib u deji shaandheynta' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {filteredHistory.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'so' ? 'Lama Helin Diiwaanno Ku Habboon' : 'No Scan Records Match'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {language === 'so'
                ? 'Lama helin baaritaanno hore oo ku habboon raadintaada. Fadlan beddel shaandhaynta ama kaamirada ku sawir caleen cusub.'
                : 'No previous crop scans found matching your search or active filters. Try clearing your filters or capture a new photo with the camera.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={onScanNewLeaf}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'so' ? 'Baar Caleen Hadda' : 'Scan Crop Leaf Now'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors cursor-pointer"
            >
              {language === 'so' ? 'Soo Celi Tusaalooyinkii' : 'Restore Sample Scans'}
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Grid Format */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHistory.map((item) => {
            const isExpanded = expandedCardId === item.id;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Image & Badges Header */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
                  <img 
                    src={item.imageUrl} 
                    alt={item.disease.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Top Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-md border border-white/20">
                      {item.source === 'Live Camera' && language === 'so' ? 'Kaamiro Toos ah' : item.source === 'File Upload' && language === 'so' ? 'Sawir La Soo Geliyay' : item.source}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${severityBadgeClass(item.severity)}`}>
                      {translateSeverity(item.severity, language)}
                    </span>
                  </div>

                  {/* Top Right Actions */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-rose-600 text-white transition-colors cursor-pointer backdrop-blur-sm"
                      title={language === 'so' ? 'Tirtir diiwaanka' : 'Delete scan entry'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Title on Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white z-10">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        {translateCrop(item.cropName, language)}
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40 text-emerald-300">
                        {item.confidence.toFixed(1)}% {language === 'so' ? 'Kalsooni' : 'Conf'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-white leading-tight">
                      {item.disease.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 italic font-serif truncate">
                      {item.disease.scientificName}
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  {/* Meta Details */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{item.fieldZone || (language === 'so' ? 'Aagga Beerta 1' : 'Field Zone Alpha')}</span>
                    </div>
                  </div>

                  {/* Pixel Decomposition Heuristic Metrics if present */}
                  {item.pixelMetrics && (
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-[11px]">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>{language === 'so' ? 'Qiyaasta Caleenta' : 'Foliage Pixel Metrics'}</span>
                        <span className="font-mono text-emerald-700">ExG: {item.pixelMetrics.excessGreenIndex.toFixed(1)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-amber-50 px-2 py-1 rounded border border-amber-200/80 flex items-center justify-between">
                          <span className="text-amber-800">{language === 'so' ? 'Jaallaha (Chlorosis):' : 'Chlorosis (Yellow):'}</span>
                          <strong className="text-amber-900 font-mono">{item.pixelMetrics.chlorosisPercent.toFixed(1)}%</strong>
                        </div>
                        <div className="bg-rose-50 px-2 py-1 rounded border border-rose-200/80 flex items-center justify-between">
                          <span className="text-rose-800">{language === 'so' ? 'Unugyada Dhintay:' : 'Necrosis (Dead):'}</span>
                          <strong className="text-rose-900 font-mono">{item.pixelMetrics.necrosisPercent.toFixed(1)}%</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes / Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.notes || item.disease.description}
                  </p>

                  {/* Status Dropdown */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">{language === 'so' ? 'Xaaladda:' : 'Status:'}</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as ScanHistoryEntry['status'])}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusBadgeClass(item.status)}`}
                      >
                        <option value="Under Observation">{language === 'so' ? 'Kormeer ku Jira' : 'Under Observation'}</option>
                        <option value="Treatment Applied">{language === 'so' ? 'Dawo La Mariyay' : 'Treatment Applied'}</option>
                        <option value="Resolved">{language === 'so' ? 'Waa Xallismay' : 'Resolved'}</option>
                        <option value="High Risk Alert">{language === 'so' ? 'Digniin Halis ah' : 'High Risk Alert'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Expandable Symptoms / Treatment */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                      <div>
                        <strong className="text-slate-800 text-[11px]">
                          {language === 'so' ? 'Astaamaha Ugu Waaweyn:' : 'Primary Symptoms:'}
                        </strong>
                        <ul className="list-disc list-inside text-slate-600 text-[11px] mt-0.5 space-y-0.5">
                          {item.disease.symptoms.slice(0, 2).map((sym, idx) => (
                            <li key={idx} className="truncate">{sym}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-emerald-900 text-[11px]">
                          {language === 'so' ? 'Dawaynta Dabiiciga ah:' : 'Organic Treatment:'}
                        </strong>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          {item.disease.organicTreatment[0]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card Action Hub */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                        className="text-emerald-700 hover:text-emerald-800 font-medium text-[11px] cursor-pointer"
                      >
                        {isExpanded 
                          ? (language === 'so' ? 'Qari Faahfaahinta' : 'Show Less') 
                          : (language === 'so' ? 'Eeg Astaamaha & Dawaynta' : 'View Symptoms & Treatment')}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => onOpenInScanner(item.disease)}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        title={language === 'so' ? 'Ku fur Baaraha' : 'Re-open in Scanner'}
                      >
                        <Stethoscope className="w-3 h-3 text-slate-600" />
                        <span>{language === 'so' ? 'Baaraha' : 'Scanner'}</span>
                      </button>

                      <button
                        onClick={() => onSendToBayes(item.disease)}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium transition-colors border border-emerald-200/60 cursor-pointer"
                        title={language === 'so' ? 'Ku xisaabi Qaacidada Bayes' : 'Calculate Outbreak Risk via Bayesian Engine'}
                      >
                        <CloudSun className="w-3 h-3 text-emerald-700" />
                        <span>{language === 'so' ? 'Bayes' : 'Bayes Risk'}</span>
                      </button>

                      <button
                        onClick={() => onConsultAgronomist(item.disease)}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-medium transition-colors border border-indigo-200/60 cursor-pointer"
                        title={language === 'so' ? 'Weydii Khabiirka AI' : 'Ask Agronomist AI about this scan'}
                      >
                        <MessageSquare className="w-3 h-3 text-indigo-700" />
                        <span>{language === 'so' ? 'Weydii AI' : 'Ask AI'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table Format */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">{language === 'so' ? 'Tusaalaha Caleenta' : 'Foliage Sample'}</th>
                  <th scope="col" className="px-4 py-3">{language === 'so' ? 'Dalagga & Cudurka' : 'Crop & Pathology'}</th>
                  <th scope="col" className="px-4 py-3">{language === 'so' ? 'Taariikhda & Aagga' : 'Date & Zone'}</th>
                  <th scope="col" className="px-4 py-3">{language === 'so' ? 'Halista & Kalsoonida' : 'Severity & Conf'}</th>
                  <th scope="col" className="px-4 py-3">{language === 'so' ? 'Xaaladda' : 'Status'}</th>
                  <th scope="col" className="px-4 py-3 text-right">{language === 'so' ? 'Ficillo' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Thumbnail & Source */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.disease.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {item.source === 'Live Camera' && language === 'so' ? 'Kaamiro' : item.source === 'File Upload' && language === 'so' ? 'Fayl' : item.source}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Crop & Pathology */}
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                          {translateCrop(item.cropName, language)}
                        </span>
                        <div className="font-bold text-slate-900 text-sm">
                          {item.disease.name}
                        </div>
                        <div className="text-[11px] text-slate-500 italic font-serif">
                          {item.disease.scientificName}
                        </div>
                      </div>
                    </td>

                    {/* Date & Zone */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{item.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{item.fieldZone || (language === 'so' ? 'Aagga Beerta 1' : 'Field Zone Alpha')}</span>
                        </div>
                      </div>
                    </td>

                    {/* Severity & Confidence */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border w-fit ${severityBadgeClass(item.severity)}`}>
                          {translateSeverity(item.severity, language)}
                        </span>
                        <span className="font-mono text-xs text-slate-600 font-medium">
                          {item.confidence.toFixed(1)}% {language === 'so' ? 'kalsooni' : 'confidence'}
                        </span>
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as ScanHistoryEntry['status'])}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusBadgeClass(item.status)}`}
                      >
                        <option value="Under Observation">{language === 'so' ? 'Kormeer ku Jira' : 'Under Observation'}</option>
                        <option value="Treatment Applied">{language === 'so' ? 'Dawo La Mariyay' : 'Treatment Applied'}</option>
                        <option value="Resolved">{language === 'so' ? 'Waa Xallismay' : 'Resolved'}</option>
                        <option value="High Risk Alert">{language === 'so' ? 'Digniin Halis ah' : 'High Risk Alert'}</option>
                      </select>
                    </td>

                    {/* Action Hub */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenInScanner(item.disease)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title={language === 'so' ? 'Ku fur Baaraha' : 'Open in Scanner'}
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSendToBayes(item.disease)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                          title={language === 'so' ? 'U dir Qaacidada Bayes' : 'Send to Bayesian Model'}
                        >
                          <CloudSun className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onConsultAgronomist(item.disease)}
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors cursor-pointer"
                          title={language === 'so' ? 'Weydii Khabiirka Beeraha' : 'Ask Agronomist AI'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 transition-colors cursor-pointer"
                          title={language === 'so' ? 'Tirtir' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
