import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Database,
  FileCheck,
  Wrench,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { runLibraryHealthCheck, repairLibrary } from '../../services/healthDiagnostics';
import { HealthCheckResult } from '../../types/library';

export const LibraryHealthScreen: React.FC = () => {
  const { items, refreshItems } = useApp();

  const [healthData, setHealthData] = useState<HealthCheckResult>(() => runLibraryHealthCheck(items));
  const [isRepairing, setIsRepairing] = useState(false);
  const [repairLogs, setRepairLogs] = useState<string[] | null>(null);

  useEffect(() => {
    setHealthData(runLibraryHealthCheck(items));
  }, [items]);

  const handleRunRepair = () => {
    setIsRepairing(true);
    setRepairLogs(null);
    setTimeout(() => {
      const { repairedItems, log } = repairLibrary(items);
      refreshItems();
      setIsRepairing(false);
      setRepairLogs(log);
      setHealthData(runLibraryHealthCheck(repairedItems));
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24">
      
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-100 flex items-center gap-2">
          <Activity className="w-6 h-6 text-amber-400" />
          Library Health & Diagnostics
        </h2>
        <p className="text-xs text-stone-400 font-sans mt-1">
          Automated integrity validation for local packages, database indexes, and offline encrypted licenses.
        </p>
      </div>

      {/* Main Status Gauge */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${
              healthData.databaseStatus === 'healthy'
                ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-400'
                : 'bg-amber-950/80 border-amber-800/60 text-amber-400'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs text-stone-400 font-sans">Database Status</span>
              <h3 className="text-lg font-serif font-medium text-stone-100 capitalize">
                Library System {healthData.databaseStatus}
              </h3>
            </div>
          </div>

          <button
            onClick={handleRunRepair}
            disabled={isRepairing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-medium transition-colors shadow active:scale-95 disabled:opacity-50"
          >
            <Wrench className={`w-4 h-4 ${isRepairing ? 'animate-spin' : ''}`} />
            <span>{isRepairing ? 'Reconstructing Catalog...' : 'Repair Library Catalog'}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          
          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Verified Packages</span>
            <span className="text-xl font-serif font-medium text-emerald-400">
              {healthData.verifiedItemsCount} OK
            </span>
          </div>

          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Broken Downloads</span>
            <span className="text-xl font-serif font-medium text-stone-200">
              {healthData.brokenDownloadsCount}
            </span>
          </div>

          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Corrupted Signatures</span>
            <span className="text-xl font-serif font-medium text-stone-200">
              {healthData.corruptedPackagesCount}
            </span>
          </div>

          <div className="p-4 bg-stone-900/80 border border-stone-800 rounded-xl space-y-1">
            <span className="text-stone-400 block">Missing Files</span>
            <span className="text-xl font-serif font-medium text-stone-200">
              {healthData.missingFilesCount}
            </span>
          </div>

        </div>

      </div>

      {/* Repair Logs Console */}
      {repairLogs && (
        <div className="bg-[#121517] border border-stone-800 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
          <h4 className="text-emerald-400 font-serif font-medium text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Library Diagnostics & Repair Log
          </h4>
          <ul className="space-y-1 text-stone-300">
            {repairLogs.map((log, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-emerald-500">[FIXED]</span>
                <span>{log}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Database Tech Stack Card */}
      <div className="bg-[#181d20] border border-stone-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-serif font-medium text-stone-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          Native Architecture & Database Stack
        </h3>
        <p className="text-xs text-stone-400 font-sans leading-relaxed">
          CalmReader Library uses a dual-layer local database strategy: <strong>Hive</strong> for high-speed key-value document reads and <strong>SQLite (WAL mode)</strong> for structured reading positions, bookmarks, and DRM license logs.
        </p>
      </div>

    </div>
  );
};
