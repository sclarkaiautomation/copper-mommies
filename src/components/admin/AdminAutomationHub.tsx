/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Database, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  RefreshCw, 
  Layers, 
  Coins, 
  Radio, 
  Sparkles,
  Check
} from 'lucide-react';

interface AdminAutomationHubProps {
  userName?: string;
  selectedState?: string;
  onShowToast?: (msg: string) => void;
}

export default function AdminAutomationHub({
  userName = 'Mama Shantrece',
  selectedState = 'GA',
  onShowToast
}: AdminAutomationHubProps) {
  // Automation Toggles State
  const [autoVettingEnabled, setAutoVettingEnabled] = useState(true);
  const [autoBannerRotation, setAutoBannerRotation] = useState(true);
  const [autoTreasurySync, setAutoTreasurySync] = useState(true);
  const [autoModScanning, setAutoModScanning] = useState(true);
  const [autoBackupsEnabled, setAutoBackupsEnabled] = useState(true);

  const [isExporting, setIsExporting] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('Today at 04:00 AM (Automated)');

  const handleRunManualBackup = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setLastBackupTime(`Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Manual Snapshot)`);
      if (onShowToast) {
        onShowToast('💾 Sovereign database backup successfully exported & archived to secure storage!');
      }
    }, 1200);
  };

  const handleToggleAutomation = (key: string, label: string) => {
    if (onShowToast) {
      onShowToast(`⚙️ Automation rule "${label}" updated successfully.`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 animate-fade-in text-[#1F1813]">
      
      {/* Hub Header Card */}
      <div className="bg-gradient-to-r from-[#1F1813] via-[#2A221B] to-[#1F1813] text-[#FAF5EE] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/40">
              <Cpu className="w-6 h-6 text-[#D4AF37]" />
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#D4AF37]">
                Copper Mommies Sovereign Operations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                Admin Automation &amp; Workflow Control Center
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
            Manage autonomous site workflows, background tracking rules, automated vetting pipelines, sponsor spotlight schedules, and treasury ledger reconciliation to eliminate manual administrative overhead across the Copper Circle.
          </p>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#B87333]">
            <span>Active Pipelines</span>
            <Zap className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1F1813]">5 / 5 Running</div>
          <p className="text-[10px] text-[#1F1813]/60 font-mono">100% System Uptime</p>
        </div>

        <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#B87333]">
            <span>Content Scanner</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1F1813]">Real-Time Active</div>
          <p className="text-[10px] text-[#1F1813]/60 font-mono">Trigger Filter On</p>
        </div>

        <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#B87333]">
            <span>Sovereign Backups</span>
            <Database className="w-4 h-4 text-[#B87333]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1F1813]">Automated</div>
          <p className="text-[10px] text-[#1F1813]/60 font-mono">Last: {lastBackupTime.split('(')[0]}</p>
        </div>

        <div className="bg-white border border-[#B87333]/20 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#B87333]">
            <span>Ledger Sync</span>
            <Coins className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1F1813]">Instant Auto-Sync</div>
          <p className="text-[10px] text-[#1F1813]/60 font-mono">Time-Credits &amp; Gigs</p>
        </div>
      </div>

      {/* Main Automation Rules List */}
      <div className="bg-white border border-[#B87333]/25 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#B87333]/20 pb-4">
          <div className="flex items-center space-x-2.5">
            <Settings className="w-5 h-5 text-[#B87333]" />
            <h3 className="font-serif font-extrabold text-lg text-[#1F1813]">
              Autonomous Workflow Engines &amp; Triggers
            </h3>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-mono font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Engines Operational</span>
          </span>
        </div>

        <div className="space-y-4">
          
          {/* Rule 1 */}
          <div className="bg-[#FAF5EE] border border-[#B87333]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#B87333] text-white rounded text-[10px] font-mono font-bold uppercase">Pipeline 01</span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Automated Vetting &amp; Member Onboarding</h4>
              </div>
              <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                Automatically assigns initial verified status and dispatches welcome packages upon successful vetting application submission, cutting manual review time by 85%.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1F1813]/70">
                {autoVettingEnabled ? 'Active' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoVettingEnabled(!autoVettingEnabled);
                  handleToggleAutomation('vetting', 'Automated Vetting');
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoVettingEnabled ? 'bg-[#B87333]' : 'bg-stone-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoVettingEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-[#FAF5EE] border border-[#B87333]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#B87333] text-white rounded text-[10px] font-mono font-bold uppercase">Pipeline 02</span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Automated Spotlight &amp; Partner Banner Schedules</h4>
              </div>
              <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                Manages featured sponsor spotlight rotations, automatically activating paid placements and expiring outdated banners according to verified reservation dates.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1F1813]/70">
                {autoBannerRotation ? 'Active' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoBannerRotation(!autoBannerRotation);
                  handleToggleAutomation('banners', 'Automated Banner Schedules');
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoBannerRotation ? 'bg-[#B87333]' : 'bg-stone-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoBannerRotation ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#FAF5EE] border border-[#B87333]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#B87333] text-white rounded text-[10px] font-mono font-bold uppercase">Pipeline 03</span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Instant Treasury &amp; Time-Credit Ledger Sync</h4>
              </div>
              <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                Synchronizes multi-stage trade handshakes and cooperative gig payments directly with member time-credit ledgers upon agreement completion.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1F1813]/70">
                {autoTreasurySync ? 'Active' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoTreasurySync(!autoTreasurySync);
                  handleToggleAutomation('treasury', 'Treasury Ledger Sync');
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoTreasurySync ? 'bg-[#B87333]' : 'bg-stone-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoTreasurySync ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="bg-[#FAF5EE] border border-[#B87333]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#B87333] text-white rounded text-[10px] font-mono font-bold uppercase">Pipeline 04</span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Real-Time Content Scanning &amp; Moderation Flagging</h4>
              </div>
              <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                Scans community forum posts, marketplace listings, and exchanges for trigger words or sensitivity guidelines, routing flagged items directly to the Grandmother Council queue.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1F1813]/70">
                {autoModScanning ? 'Active' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoModScanning(!autoModScanning);
                  handleToggleAutomation('moderation', 'Content Scanning');
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoModScanning ? 'bg-[#B87333]' : 'bg-stone-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoModScanning ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="bg-[#FAF5EE] border border-[#B87333]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#B87333] text-white rounded text-[10px] font-mono font-bold uppercase">Pipeline 05</span>
                <h4 className="font-serif font-bold text-base text-[#1F1813]">Automated Sovereign Data Backups</h4>
              </div>
              <p className="text-xs text-[#1F1813]/75 leading-relaxed">
                Generates encrypted database snapshots of member directories, trade logs, and verified business rosters every 24 hours at 04:00 AM.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1F1813]/70">
                {autoBackupsEnabled ? 'Active' : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoBackupsEnabled(!autoBackupsEnabled);
                  handleToggleAutomation('backups', 'Automated Backups');
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoBackupsEnabled ? 'bg-[#B87333]' : 'bg-stone-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoBackupsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

        </div>

        {/* Manual Action Bar */}
        <div className="pt-4 border-t border-[#B87333]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#1F1813]/70 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#B87333]" />
            <span>Last automated backup snapshot: {lastBackupTime}</span>
          </div>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleRunManualBackup}
            className="px-5 py-2.5 bg-[#1F1813] hover:bg-[#B87333] text-[#FAF5EE] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>Exporting Snapshot...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Run Immediate Database Backup</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
