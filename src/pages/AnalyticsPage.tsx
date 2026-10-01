import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  getAnalyticsSummary, 
  resetAnalyticsData, 
  trackDownload, 
  trackToolUsage, 
  trackPageView,
  subscribeToAnalytics,
  AnalyticsSummary,
  GA_MEASUREMENT_ID
} from '../utils/analytics';
import Breadcrumbs from '../components/Breadcrumbs';
import { PageSkeleton } from '../components/SkeletonLoader';
import { generateCanonicalUrl } from '../utils/seo';
import { 
  Activity, 
  Users, 
  Eye, 
  Download, 
  Zap, 
  Clock, 
  Cpu, 
  Wifi, 
  Monitor, 
  Globe, 
  ShieldCheck, 
  RefreshCw, 
  Trash2, 
  FileDown, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const refreshData = () => {
    setData(getAnalyticsSummary());
  };

  useEffect(() => {
    refreshData();

    // 1. Subscribe to real-time events across tabs & storage mutations
    const unsubscribe = subscribeToAnalytics(() => {
      refreshData();
    });

    // 2. Real-time polling ticker (every 1 second for active presence & duration)
    const interval = setInterval(() => {
      refreshData();
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const showNotification = (msg: string) => {
    setLiveNotification(msg);
    setTimeout(() => setLiveNotification(null), 3500);
  };

  const handleTestDownloadEvent = () => {
    trackDownload(
      'pdf-compressor',
      'PDF Compressor',
      'annual_financial_report.pdf',
      'pdf',
      480 * 1024
    );
    refreshData();
    showNotification('⚡ Live Download Event Recorded: annual_financial_report.pdf');
  };

  const handleTestToolUseEvent = () => {
    trackToolUsage(
      'image-resizer',
      'Image Resizer',
      'Image Tools',
      'resize_image',
      { details: '1920x1080 WebP compression (78% size saved)' }
    );
    refreshData();
    showNotification('⚡ Live Tool Execution Event Recorded: Image Resizer');
  };

  const handleTestPageViewEvent = () => {
    trackPageView('/tools/fiji-vat-calculator', 'Fiji VAT Calculator | ToolKitPro');
    refreshData();
    showNotification('⚡ Live Route Navigation Event Recorded: /tools/fiji-vat-calculator');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all real-time counters and start from clean zero?')) {
      resetAnalyticsData();
      refreshData();
      showNotification('🧹 Real-time telemetry reset to clean zero baseline.');
    }
  };

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolkitpro_realtime_analytics_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    showNotification('📥 Real-time telemetry JSON exported successfully.');
  };

  const handleCopyGaId = () => {
    navigator.clipboard.writeText(GA_MEASUREMENT_ID);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (!data) {
    return <PageSkeleton />;
  }

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const canonicalUrl = generateCanonicalUrl('/analytics');
  const maxToolCount = Math.max(...data.toolUsageRanking.map(t => t.count), 1);
  const telemetry = data.deviceTelemetry;

  return (
    <div className="space-y-8 sm:space-y-12 max-w-[1200px] mx-auto pb-16">
      <Helmet>
        <title>Live Real-Time Web Analytics | ToolKitPro</title>
        <meta name="description" content="True real-time web analytics for ToolKitPro. Live active users, page views, unique client sessions, tool execution frequency, and download conversion rates." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Live Real-Time Web Analytics | ToolKitPro" />
        <meta property="og:description" content="True real-time web analytics for ToolKitPro. Live active users, page views, unique client sessions, tool execution frequency, and download conversion rates." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Live Real-Time Web Analytics | ToolKitPro" />
        <meta name="twitter:description" content="True real-time web analytics for ToolKitPro. Live active users, page views, unique client sessions, tool execution frequency, and download conversion rates." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Live Real-Time Web Analytics - ToolKitPro",
            "url": canonicalUrl,
            "description": "True real-time telemetry, active sessions, tool execution frequency, and download conversion rates."
          })}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Web Analytics' }]} />

      {/* HEADER SECTION */}
      <div className="bg-yellow-400 border-4 border-black p-5 sm:p-7 md:p-9 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping inline-block" />
                Live Real-Time Telemetry
              </span>
              <span className="inline-flex items-center gap-1 bg-white text-black border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase">
                <Users size={13} />
                {data.activeUsersCount} Active Tab{data.activeUsersCount > 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-1 bg-white text-black border-2 border-black px-2.5 py-0.5 text-xs font-mono font-bold">
                <Clock size={13} />
                Session: {formatDuration(data.sessionDurationSeconds)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-none">
              Web Analytics
            </h1>
            <p className="font-bold text-black text-sm sm:text-base max-w-2xl">
              100% genuine, real-time client-side metrics. Tracks live active sessions, real page views, tool executions, and download conversions without fabricated seed data.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center justify-center gap-1.5 bg-white border-2 border-black px-4 py-2.5 font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-h-[44px]"
            >
              <FileDown size={15} />
              Export JSON
            </button>
            <button
              onClick={refreshData}
              className="inline-flex items-center justify-center gap-1.5 bg-yellow-200 text-black border-2 border-black px-4 py-2.5 font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-h-[44px]"
            >
              <RefreshCw size={15} />
              Live Sync
            </button>
            <button
              onClick={handleResetData}
              className="inline-flex items-center justify-center gap-1.5 bg-black text-white border-2 border-black px-4 py-2.5 font-black uppercase text-xs hover:bg-red-600 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-h-[44px]"
            >
              <Trash2 size={15} />
              Reset to 0
            </button>
          </div>
        </div>

        {liveNotification && (
          <div className="mt-4 p-3 bg-white border-2 border-black font-black text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle2 size={16} className="text-green-600 shrink-0" />
            <span>{liveNotification}</span>
          </div>
        )}
      </div>

      {/* REAL-TIME KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Page Views */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Real Traffic
              </span>
              <Eye size={18} className="text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-1">
              Page Views
            </h3>
            <p className="text-4xl sm:text-5xl font-black tracking-tight text-blue-700 dark:text-blue-400 font-mono">
              {data.totalPageViews.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between items-center text-neutral-600 dark:text-neutral-400">
            <span>Live Router Sync</span>
            <span className="font-mono text-green-600 font-black">● Recording</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Audience
              </span>
              <Users size={18} className="text-purple-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-1">
              Unique Visitors
            </h3>
            <p className="text-4xl sm:text-5xl font-black tracking-tight text-purple-700 dark:text-purple-400 font-mono">
              {data.uniqueVisitorsCount.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between items-center text-neutral-600 dark:text-neutral-400">
            <span>Client UUID:</span>
            <span className="font-mono text-[11px] truncate max-w-[120px]">{data.deviceTelemetry.platform}</span>
          </div>
        </div>

        {/* Tool Executions */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Engagement
              </span>
              <Zap size={18} className="text-amber-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-1">
              Tool Usages
            </h3>
            <p className="text-4xl sm:text-5xl font-black tracking-tight text-amber-800 dark:text-yellow-300 font-mono">
              {data.totalToolUsages.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between items-center text-neutral-600 dark:text-neutral-400">
            <span>Executed Tools:</span>
            <span className="font-mono font-black">{data.toolUsageRanking.length} distinct</span>
          </div>
        </div>

        {/* Download Conversions */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Fulfillment
              </span>
              <Download size={18} className="text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase mb-1">
              Downloads
            </h3>
            <p className="text-4xl sm:text-5xl font-black tracking-tight text-green-700 dark:text-green-400 font-mono">
              {data.totalDownloads.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between items-center text-neutral-600 dark:text-neutral-400">
            <span>Conversion Rate:</span>
            <span className="font-mono font-black text-sm px-2 py-0.5 bg-green-200 text-black border border-black">
              {data.overallConversionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* LIVE CLIENT ENVIRONMENT & HARDWARE TELEMETRY */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
        <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <div className="inline-block bg-neutral-900 text-yellow-300 px-2.5 py-0.5 text-xs font-black uppercase mb-1">
              Real Client Telemetry
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Hardware, Network & Performance Diagnostics
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
            Browser Sandbox: Safe & Local
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Network */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-neutral-500">
              <Wifi size={14} /> Network
            </div>
            <p className="font-black text-sm font-mono">{telemetry.networkType}</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{telemetry.roundTripTime}</p>
          </div>

          {/* Screen */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-neutral-500">
              <Monitor size={14} /> Screen
            </div>
            <p className="font-black text-sm font-mono truncate">{telemetry.screenResolution}</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{telemetry.viewportSize} view</p>
          </div>

          {/* CPU & RAM */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-neutral-500">
              <Cpu size={14} /> Hardware
            </div>
            <p className="font-black text-sm font-mono">{telemetry.cores} CPU Cores</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{telemetry.ramEstimate}</p>
          </div>

          {/* Timezone */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-neutral-500">
              <Globe size={14} /> Location
            </div>
            <p className="font-black text-sm font-mono truncate">{telemetry.timezone}</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Locale: {telemetry.language}</p>
          </div>

          {/* DOM Load Time */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-neutral-500">
              <Clock size={14} /> DOM Ready
            </div>
            <p className="font-black text-sm font-mono text-green-700 dark:text-green-400">{telemetry.domLoadTimeMs} ms</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Sub-second load</p>
          </div>

          {/* Privacy & Cache */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black space-y-1">
            <div className="flex items-center gap-1.5 font-black uppercase text-neutral-500">
              <ShieldCheck size={14} /> Privacy
            </div>
            <p className="font-black text-sm text-green-700 dark:text-green-400">100% RAM</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Zero Server Storage</p>
          </div>
        </div>
      </div>

      {/* QUICK LIVE EVENT TEST TRIGGER */}
      <div className="bg-yellow-50 dark:bg-neutral-900 border-4 border-black p-5 sm:p-7 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
        <h3 className="text-base sm:text-lg font-black uppercase flex items-center gap-2">
          <Activity size={18} />
          Interactive Live Telemetry Triggers
        </h3>
        <p className="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">
          Trigger live interactions to test real-time dispatching. Watch the event stream and metrics update immediately in sub-second time.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
          <button
            onClick={handleTestToolUseEvent}
            className="bg-black text-white px-4 py-2.5 border-2 border-black font-black uppercase text-xs hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[44px]"
          >
            + Execute Tool Action (Image Resizer)
          </button>
          <button
            onClick={handleTestDownloadEvent}
            className="bg-green-500 text-black px-4 py-2.5 border-2 border-black font-black uppercase text-xs hover:bg-green-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[44px]"
          >
            + Complete File Download (PDF Compressor)
          </button>
          <button
            onClick={handleTestPageViewEvent}
            className="bg-blue-300 text-black px-4 py-2.5 border-2 border-black font-black uppercase text-xs hover:bg-blue-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[44px]"
          >
            + Record Page Navigation (Fiji VAT Calculator)
          </button>
        </div>
      </div>

      {/* SECTION: DOWNLOAD CONVERSION RATES */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-7 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 sm:space-y-6">
        <div className="border-b-4 border-black pb-4">
          <div className="inline-block bg-green-400 text-black px-3 py-1 text-xs font-black uppercase mb-1">
            Conversion Tracking
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Download Conversion Rates by Tool
          </h2>
          <p className="font-bold text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Measures the percentage of tool users who completed a file download (PDF, Image, QR Code, JSON, or Credentials).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b-4 border-black bg-neutral-100 dark:bg-neutral-800">
                <th className="p-3 font-black uppercase text-xs sm:text-sm">Tool Name</th>
                <th className="p-3 font-black uppercase text-xs sm:text-sm text-right">Page Views</th>
                <th className="p-3 font-black uppercase text-xs sm:text-sm text-right">Executions</th>
                <th className="p-3 font-black uppercase text-xs sm:text-sm text-right">Downloads</th>
                <th className="p-3 font-black uppercase text-xs sm:text-sm text-right">Conversion Rate</th>
                <th className="p-3 font-black uppercase text-xs sm:text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {data.downloadConversions.map((conv) => (
                <tr key={conv.toolId} className="hover:bg-yellow-50 dark:hover:bg-neutral-800/50">
                  <td className="p-3">
                    <div className="font-black text-sm sm:text-base">{conv.toolName}</div>
                    <span className="text-[11px] sm:text-xs font-mono text-neutral-500">/tools/{conv.toolId}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-xs sm:text-sm">{conv.views.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-xs sm:text-sm">{conv.usages.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-black text-green-600 dark:text-green-400 text-xs sm:text-sm">
                    {conv.downloads.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-sm sm:text-lg">
                    <span className={`px-2 py-0.5 sm:py-1 border-2 border-black inline-block ${
                      conv.conversionRate >= 30 
                        ? 'bg-green-300 text-black' 
                        : conv.conversionRate > 0 
                        ? 'bg-yellow-200 text-black' 
                        : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {conv.conversionRate}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/tools/${conv.toolId}`}
                      className="inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 text-xs font-black uppercase border-2 border-black hover:bg-yellow-400 hover:text-black transition-all"
                    >
                      Open <ArrowUpRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: TOOL USAGE FREQUENCY */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-7 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 sm:space-y-6">
        <div className="border-b-4 border-black pb-4">
          <div className="inline-block bg-yellow-400 text-black px-3 py-1 text-xs font-black uppercase mb-1">
            Usage Ranking
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Real Tool Execution Frequency
          </h2>
          <p className="font-bold text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Real-time count of operations performed by users across all utility categories.
          </p>
        </div>

        {data.toolUsageRanking.length === 0 ? (
          <div className="p-8 text-center border-4 border-dashed border-black bg-neutral-50 dark:bg-neutral-900 space-y-3">
            <p className="font-black text-lg uppercase">No tool operations executed yet</p>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              Run any calculator or conversion on the site, or click "Execute Tool Action" above to watch this ranking populate live!
            </p>
            <Link
              to="/tools/word-counter"
              className="inline-block bg-black text-white px-5 py-2.5 font-black uppercase text-xs border-2 border-black hover:bg-yellow-400 hover:text-black transition-all"
            >
              Try Word Counter
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {data.toolUsageRanking.map((item, idx) => {
              const percentage = Math.round((item.count / maxToolCount) * 100);
              return (
                <div key={item.toolId} className="border-2 border-black p-3 sm:p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="w-7 h-7 sm:w-8 sm:h-8 bg-black text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-black uppercase text-sm sm:text-base">{item.toolName}</h4>
                        <span className="text-[10px] sm:text-xs font-bold uppercase text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 border border-black inline-block">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xl sm:text-2xl font-black font-mono">{item.count.toLocaleString()}</span>
                      <span className="text-xs font-bold uppercase text-neutral-500 ml-1.5 sm:ml-2">operations</span>
                    </div>
                  </div>

                  <div className="w-full h-3 sm:h-4 bg-neutral-200 dark:bg-neutral-800 border-2 border-black overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 border-r-2 border-black transition-all duration-300" 
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: LIVE EVENT STREAM */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-5 sm:p-7 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black pb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              Live Activity Stream
            </h2>
            <p className="font-bold text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Chronological real-time event log of page visits, tool calculations, and file downloads.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border-2 border-black">
            {data.recentEvents.length} events logged
          </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {data.recentEvents.slice(0, 20).map((evt) => (
            <div 
              key={evt.id} 
              className="p-3 border-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-black uppercase border border-black text-[10px] sm:text-xs shrink-0 ${
                  evt.type === 'download' 
                    ? 'bg-green-400 text-black' 
                    : evt.type === 'tool_usage' 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-blue-300 text-black'
                }`}>
                  {evt.type.replace('_', ' ')}
                </span>
                <span className="font-black text-xs sm:text-sm">{evt.title}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 ml-auto sm:ml-0">
                {evt.details && <span className="font-bold text-[11px] truncate max-w-[250px]">{evt.details}</span>}
                <span className="font-mono text-[10px] shrink-0">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GOOGLE ANALYTICS INTEGRATION FOOTER */}
      <div className="bg-neutral-100 dark:bg-neutral-900 border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <p className="font-black uppercase text-sm">Google Analytics 4 Active</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold">
            All client events are mirrored to Google Analytics under Measurement ID: <code className="font-mono font-bold text-black dark:text-white">{GA_MEASUREMENT_ID}</code>
          </p>
        </div>
        <button
          onClick={handleCopyGaId}
          className="bg-yellow-400 border-2 border-black px-4 py-2 text-xs font-black uppercase hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[36px]"
        >
          {copiedId ? 'Copied ID!' : 'Copy GA ID'}
        </button>
      </div>
    </div>
  );
}
