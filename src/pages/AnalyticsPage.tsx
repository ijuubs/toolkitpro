import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  getAnalyticsSummary, 
  resetAnalyticsData, 
  trackDownload, 
  trackToolUsage, 
  AnalyticsSummary,
  GA_MEASUREMENT_ID
} from '../utils/analytics';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshData = () => {
    setData(getAnalyticsSummary());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTestDownloadEvent = () => {
    trackDownload(
      'pdf-compressor',
      'PDF Compressor',
      'sample_financial_report.pdf',
      'pdf',
      450 * 1024
    );
    refreshData();
    setMessage('Simulated download conversion event recorded & dispatched to Google Analytics!');
    setTimeout(() => setMessage(null), 4000);
  };

  const handleTestToolUseEvent = () => {
    trackToolUsage(
      'image-resizer',
      'Image Resizer',
      'Design & Media',
      'batch_resize',
      { details: 'Simulated 1920x1080 resolution batch conversion' }
    );
    refreshData();
    setMessage('Simulated tool usage event recorded & dispatched to Google Analytics!');
    setTimeout(() => setMessage(null), 4000);
  };

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolkitpro_analytics_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleCopyGaId = () => {
    navigator.clipboard.writeText(GA_MEASUREMENT_ID);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-8 border-black border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxToolCount = Math.max(...data.toolUsageRanking.map(t => t.count), 1);

  return (
    <div className="space-y-12 max-w-[1200px] mx-auto pb-16">
      <Helmet>
        <title>Web Analytics Dashboard | ToolKitPro</title>
        <meta name="description" content="Live web analytics for ToolKitPro: Track page views, unique visitors, tool usage frequency, and conversion rates for downloads." />
        <link rel="canonical" href="https://toolkitpro.app/analytics" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Web Analytics Dashboard - ToolKitPro",
            "url": "https://toolkitpro.app/analytics",
            "description": "Live metrics, tool usage frequency, and download conversion rates."
          })}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Web Analytics' }]} />

      {/* HEADER SECTION */}
      <div className="bg-yellow-400 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-wider mb-2">
              Telemetry & Metrics Engine
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-black">
              Web Analytics
            </h1>
            <p className="font-bold text-black mt-2 text-base md:text-lg">
              Live tracking for Page Views, Unique Visitors, Tool Usage Frequency, and Download Conversions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportJson}
              className="bg-white border-2 border-black px-4 py-2 font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Export JSON Report
            </button>
            <button
              onClick={() => { resetAnalyticsData(); refreshData(); }}
              className="bg-black text-white border-2 border-black px-4 py-2 font-black uppercase text-xs hover:bg-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Reset Baseline
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-green-200 border-2 border-black font-black text-xs uppercase animate-pulse">
            {message}
          </div>
        )}
      </div>

      {/* GOOGLE ANALYTICS INTEGRATION STATUS */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500 animate-ping" />
            <div>
              <h2 className="text-xl font-black uppercase tracking-wide">
                Google Analytics 4 (gtag.js) Active
              </h2>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                Connected and actively dispatching page_view, tool_usage, and conversion events.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase bg-gray-100 dark:bg-gray-800 border-2 border-black px-3 py-1 font-mono">
              Measurement ID: {GA_MEASUREMENT_ID}
            </span>
            <button
              onClick={handleCopyGaId}
              className="bg-yellow-400 border-2 border-black px-3 py-1 text-xs font-black uppercase hover:bg-black hover:text-white transition-all"
            >
              {copiedId ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <div className="p-3 bg-gray-50 dark:bg-[#252525] border-2 border-black">
            <p className="text-gray-500 uppercase">Tracked Event</p>
            <p className="font-black text-sm">page_view</p>
            <span className="text-[10px] text-green-600 font-black">● Automatic SPA Router</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#252525] border-2 border-black">
            <p className="text-gray-500 uppercase">Tracked Event</p>
            <p className="font-black text-sm">tool_usage</p>
            <span className="text-[10px] text-green-600 font-black">● Real-time Frequency</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#252525] border-2 border-black">
            <p className="text-gray-500 uppercase">Tracked Event</p>
            <p className="font-black text-sm">file_download</p>
            <span className="text-[10px] text-green-600 font-black">● Size & File Extension</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#252525] border-2 border-black">
            <p className="text-gray-500 uppercase">Goal Event</p>
            <p className="font-black text-sm">conversion</p>
            <span className="text-[10px] text-green-600 font-black">● Download Conversion</span>
          </div>
        </div>
      </div>

      {/* CORE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Page Views */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Total Traffic
          </div>
          <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-2">
            Page Views
          </h3>
          <p className="text-5xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-mono">
            {data.totalPageViews.toLocaleString()}
          </p>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between">
            <span>Route Changes:</span>
            <span className="font-mono text-green-600">Active</span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Audience Reach
          </div>
          <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-2">
            Unique Visitors
          </h3>
          <p className="text-5xl font-black tracking-tight text-purple-600 dark:text-purple-400 font-mono">
            {data.uniqueVisitorsCount.toLocaleString()}
          </p>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between">
            <span>Identified Client UUIDs:</span>
            <span className="font-mono">{data.uniqueVisitorsCount} users</span>
          </div>
        </div>

        {/* Tool Usage Frequency */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Engagement
          </div>
          <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-2">
            Tool Usages
          </h3>
          <p className="text-5xl font-black tracking-tight text-yellow-500 dark:text-yellow-400 font-mono">
            {data.totalToolUsages.toLocaleString()}
          </p>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between">
            <span>Active Utilities:</span>
            <span className="font-mono">{data.toolUsageRanking.length} tools</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Fulfillment
          </div>
          <h3 className="text-2xl font-black uppercase text-black dark:text-white mb-2">
            Download Conv.
          </h3>
          <p className="text-5xl font-black tracking-tight text-green-600 dark:text-green-400 font-mono">
            {data.overallConversionRate}%
          </p>
          <div className="mt-4 pt-3 border-t-2 border-black text-xs font-bold flex justify-between">
            <span>Total Downloads:</span>
            <span className="font-mono">{data.totalDownloads.toLocaleString()} files</span>
          </div>
        </div>
      </div>

      {/* QUICK SIMULATION ACTIONS */}
      <div className="bg-gray-100 dark:bg-[#202020] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-black uppercase mb-2">
          Test Analytics Event Dispatchers
        </h3>
        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-4">
          Click to simulate real interactions and watch them log live to both Google Analytics and the internal tracking engine.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTestToolUseEvent}
            className="bg-black text-white px-4 py-2 border-2 border-black font-black uppercase text-xs hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            + Trigger Tool Usage (Image Resizer)
          </button>
          <button
            onClick={handleTestDownloadEvent}
            className="bg-green-500 text-black px-4 py-2 border-2 border-black font-black uppercase text-xs hover:bg-green-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            + Trigger Download Conversion (PDF Compressor)
          </button>
        </div>
      </div>

      {/* SECTION: DOWNLOAD CONVERSION RATES */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="border-b-4 border-black pb-4">
          <div className="inline-block bg-green-400 text-black px-3 py-1 text-xs font-black uppercase mb-1">
            Conversion Optimization
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Download Conversion Rates by Tool
          </h2>
          <p className="font-bold text-sm text-gray-600 dark:text-gray-400">
            Measures the percentage of visitors who view a tool and successfully complete a file download (PDF, Image, QR, or JSON).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black bg-gray-50 dark:bg-[#252525]">
                <th className="p-3 font-black uppercase text-sm">Tool Name</th>
                <th className="p-3 font-black uppercase text-sm text-right">Page Views</th>
                <th className="p-3 font-black uppercase text-sm text-right">Executions</th>
                <th className="p-3 font-black uppercase text-sm text-right">Downloads</th>
                <th className="p-3 font-black uppercase text-sm text-right">Conversion Rate</th>
                <th className="p-3 font-black uppercase text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {data.downloadConversions.map((conv) => (
                <tr key={conv.toolId} className="hover:bg-yellow-50 dark:hover:bg-gray-800/50">
                  <td className="p-3">
                    <div className="font-black text-base">{conv.toolName}</div>
                    <span className="text-xs font-mono text-gray-500">/tools/{conv.toolId}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">{conv.views.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold">{conv.usages.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-black text-green-600 dark:text-green-400">
                    {conv.downloads.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-lg">
                    <span className={`px-2 py-1 border-2 border-black inline-block ${
                      conv.conversionRate >= 45 ? 'bg-green-300 text-black' : 'bg-yellow-200 text-black'
                    }`}>
                      {conv.conversionRate}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/tools/${conv.toolId}`}
                      className="inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase border-2 border-black hover:bg-yellow-400 hover:text-black transition-all"
                    >
                      Open Tool
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: TOOL USAGE FREQUENCY */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="border-b-4 border-black pb-4">
          <div className="inline-block bg-yellow-400 text-black px-3 py-1 text-xs font-black uppercase mb-1">
            Usage Distribution
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Tool Usage Frequency Ranking
          </h2>
          <p className="font-bold text-sm text-gray-600 dark:text-gray-400">
            Real-time tally of operations processed per tool across all utility categories.
          </p>
        </div>

        <div className="space-y-4">
          {data.toolUsageRanking.map((item, idx) => {
            const percentage = Math.round((item.count / maxToolCount) * 100);
            return (
              <div key={item.toolId} className="border-2 border-black p-4 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-black uppercase text-base">{item.toolName}</h4>
                      <span className="text-xs font-bold uppercase text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 border border-black inline-block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono">{item.count.toLocaleString()}</span>
                    <span className="text-xs font-bold uppercase text-gray-500 ml-2">operations</span>
                  </div>
                </div>

                {/* Neu-brutalist progress bar */}
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 border-2 border-black overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 border-r-2 border-black transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: LIVE EVENT STREAM */}
      <div className="bg-white dark:bg-[#1a1a1a] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="flex justify-between items-center border-b-4 border-black pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Live Activity Stream
            </h2>
            <p className="font-bold text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Chronological log of recent page visits, tool operations, and download conversions.
            </p>
          </div>
          <button
            onClick={refreshData}
            className="bg-black text-white px-3 py-1 font-black text-xs uppercase border-2 border-black hover:bg-yellow-400 hover:text-black transition-all"
          >
            Refresh Feed
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {data.recentEvents.slice(0, 15).map((evt) => (
            <div 
              key={evt.id} 
              className="p-3 border-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-black uppercase border border-black ${
                  evt.type === 'download' 
                    ? 'bg-green-400 text-black' 
                    : evt.type === 'tool_usage' 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-blue-300 text-black'
                }`}>
                  {evt.type.replace('_', ' ')}
                </span>
                <span className="font-black text-sm">{evt.title}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                {evt.details && <span className="font-bold">{evt.details}</span>}
                <span className="font-mono text-[10px]">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
