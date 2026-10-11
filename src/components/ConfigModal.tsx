import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Shield, 
  Repeat2, 
  Zap, 
  Battery, 
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';
import { AgentConfig } from '../types/agent';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  onSave: (updated: Partial<AgentConfig>) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [maxRetries, setMaxRetries] = useState(config.maxRetries || 3);
  const [maxCycles, setMaxCycles] = useState(config.maxCyclesPerRun || 25);
  const [autoApproveRead, setAutoApproveRead] = useState(config.autoApproveReadOnly ?? true);
  const [requirePrApproval, setRequirePrApproval] = useState(config.requireApprovalForPr ?? true);
  const [requireWriteApproval, setRequireWriteApproval] = useState(config.requireApprovalForWrite ?? true);
  const [batterySaver, setBatterySaver] = useState(config.batterySaver ?? false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      maxRetries,
      maxCyclesPerRun: maxCycles,
      autoApproveReadOnly: autoApproveRead,
      requireApprovalForPr: requirePrApproval,
      requireApprovalForWrite: requireWriteApproval,
      batterySaver
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Resource Limits & Safety Guardrails
              </h3>
              <p className="text-xs text-slate-400">
                Prevent infinite loops, unbounded quotas, and unverified commits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 text-xs">
          {/* Max Retries */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Repeat2 className="w-4 h-4 text-amber-400" />
                Max Failure Retries per Task: <strong className="text-amber-400">{maxRetries}</strong>
              </span>
              <span className="text-[11px] text-slate-500">Marks BLOCKED afterwards</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={maxRetries}
              onChange={e => setMaxRetries(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Max Autonomous Cycles */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                Circuit Breaker: Max Autonomous Cycles: <strong className="text-cyan-400">{maxCycles}</strong>
              </span>
              <span className="text-[11px] text-slate-500">Halts automatically</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxCycles}
              onChange={e => setMaxCycles(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-slate-200 font-semibold block">Auto-Approve Read-Only Tools</span>
                <span className="text-[11px] text-slate-400">File inspection, dependency check, manifests</span>
              </div>
              <input
                type="checkbox"
                checked={autoApproveRead}
                onChange={e => setAutoApproveRead(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-slate-200 font-semibold block">Require Approval for Pull Request</span>
                <span className="text-[11px] text-slate-400">Stops loop and asks user before creating PR</span>
              </div>
              <input
                type="checkbox"
                checked={requirePrApproval}
                onChange={e => setRequirePrApproval(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-slate-200 font-semibold block">Require Approval for Disk Code Changes</span>
                <span className="text-[11px] text-slate-400">Prompts user before writing modified code patch</span>
              </div>
              <input
                type="checkbox"
                checked={requireWriteApproval}
                onChange={e => setRequireWriteApproval(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-slate-200 font-semibold block flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  Android Battery & Data Saver Mode
                </span>
                <span className="text-[11px] text-slate-400">Reduces background polling rate from 2s to 6s</span>
              </div>
              <input
                type="checkbox"
                checked={batterySaver}
                onChange={e => setBatterySaver(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>

          {/* AI Model Specification */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Zero-Cost Model:</span>
            <span className="font-mono text-emerald-400 font-semibold">gemini-3.8-flash (Free Tier)</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
