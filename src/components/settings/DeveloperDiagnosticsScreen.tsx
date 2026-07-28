import React, { useState } from 'react';
import {
  Terminal,
  Database,
  RefreshCw,
  Download,
  Trash2,
  Wifi,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';

export const DeveloperDiagnosticsScreen: React.FC = () => {
  const { items, isOnline, toggleOnlineOverride } = useApp();
  const [logs, setLogs] = useState(() => storageService.getSyncLogs());
  const [copied, setCopied] = useState(false);

  const handleRefreshLogs = () => {
    setLogs(storageService.getSyncLogs());
  };

  const handleClearLogs = () => {
    storageService.clearSyncLogs();
    setLogs([]);
  };

  const handleExportLogsJson = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calmreader_diagnostics_logs_${Date.now()}.json`;
    a.click();
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 font-mono">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-amber-400" />
          Developer Diagnostics Console
        </h2>
        <p className="text-xs text-stone-400 font-sans mt-1">
          Low-level inspection of Hive/SQLite database state, raw sync queues, network throttling, and event telemetry.
        </p>
      </div>

      {/* Tech Specifications Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-[#181d20] border border-stone-800 rounded-xl space-y-1">
          <span className="text-stone-500 block font-sans">Database Engines</span>
          <span className="text-stone-200 font-bold block">Hive v2.2.3 + SQLite v3.42</span>
          <span className="text-[10px] text-emerald-400">WAL Mode Active</span>
        </div>

        <div className="p-4 bg-[#181d20] border border-stone-800 rounded-xl space-y-1">
          <span className="text-stone-500 block font-sans">API Endpoint</span>
          <span className="text-amber-400 font-bold block truncate">https://api.calmreader.app/v2/companion/sync</span>
          <span className="text-[10px] text-stone-400">TLS 1.3 AES-256-GCM</span>
        </div>

        <div className="p-4 bg-[#181d20] border border-stone-800 rounded-xl space-y-1">
          <span className="text-stone-500 block font-sans">Simulated Network</span>
          <button
            onClick={toggleOnlineOverride}
            className="text-stone-200 font-bold flex items-center gap-1.5 hover:text-amber-400"
          >
            <Wifi className="w-4 h-4 text-amber-400" />
            <span>{isOnline ? 'Online (WiFi 100Mbps)' : 'Offline (Disconnected)'}</span>
          </button>
        </div>
      </div>

      {/* Event Logs Console */}
      <div className="bg-[#121518] border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-serif font-medium text-stone-200">
              Sync Engine & Telemetry Logs ({logs.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleExportLogsJson}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleClearLogs}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Console Container */}
        <div className="bg-black/80 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[11px] space-y-2 border border-stone-800">
          {logs.length === 0 ? (
            <p className="text-stone-500 italic">No event logs generated yet.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="text-stone-300 border-b border-stone-900 pb-1.5">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-stone-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-amber-400 uppercase font-semibold">{log.action}</span>
                  <span className={`px-1 rounded text-[9px] ${
                    log.status === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-stone-400 text-[11px] mt-0.5">{log.details}</p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
