import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Terminal, 
  CheckCheck, 
  Copy, 
  Check, 
  FileCode,
  Sparkles
} from 'lucide-react';
import { TaskItem, VerificationStatus } from '../types/agent';

interface VerificationPanelProps {
  tasks: TaskItem[];
  onRunStep: () => void;
  isLoading: boolean;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  tasks,
  onRunStep,
  isLoading
}) => {
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'ALL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const passCount = tasks.filter(t => t.verification.status === 'PASS').length;
  const failCount = tasks.filter(t => t.verification.status === 'FAIL').length;
  const blockedCount = tasks.filter(t => t.verification.status === 'BLOCKED').length;
  const notRunCount = tasks.filter(t => t.verification.status === 'NOT_RUN').length;

  const filteredTasks = tasks.filter(t => {
    if (selectedStatus === 'ALL') return true;
    return t.verification.status === selectedStatus;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              QA & Evidence Verification Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Rule #8: Every task requires explicit expected outcome, verification method, and recorded evidence.
          </p>
        </div>

        <button
          onClick={onRunStep}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verify Next Task</span>
        </button>
      </div>

      {/* Verification Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setSelectedStatus('PASS')}
          className={`p-3 rounded-xl border text-left transition ${
            selectedStatus === 'PASS'
              ? 'bg-emerald-500/15 border-emerald-500/50 ring-1 ring-emerald-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">PASS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 mt-1">{passCount}</div>
          <span className="text-[10px] text-slate-500">Verified by evidence</span>
        </button>

        <button
          onClick={() => setSelectedStatus('FAIL')}
          className={`p-3 rounded-xl border text-left transition ${
            selectedStatus === 'FAIL'
              ? 'bg-rose-500/15 border-rose-500/50 ring-1 ring-rose-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">FAIL</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400 mt-1">{failCount}</div>
          <span className="text-[10px] text-slate-500">Requires safe retry</span>
        </button>

        <button
          onClick={() => setSelectedStatus('BLOCKED')}
          className={`p-3 rounded-xl border text-left transition ${
            selectedStatus === 'BLOCKED'
              ? 'bg-purple-500/15 border-purple-500/50 ring-1 ring-purple-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">BLOCKED</span>
            <AlertTriangle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400 mt-1">{blockedCount}</div>
          <span className="text-[10px] text-slate-500">Exceeded retries / gated</span>
        </button>

        <button
          onClick={() => setSelectedStatus('NOT_RUN')}
          className={`p-3 rounded-xl border text-left transition ${
            selectedStatus === 'NOT_RUN'
              ? 'bg-slate-800 border-slate-600 ring-1 ring-slate-600'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">NOT_RUN</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-300 mt-1">{notRunCount}</div>
          <span className="text-[10px] text-slate-500">Queued in plan</span>
        </button>
      </div>

      {/* Filter Reset if active */}
      {selectedStatus !== 'ALL' && (
        <div className="flex items-center justify-between mb-3 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">
            Showing only <strong className="text-cyan-400 font-mono">{selectedStatus}</strong> verifications
          </span>
          <button
            onClick={() => setSelectedStatus('ALL')}
            className="text-cyan-400 hover:underline font-medium"
          >
            Show All
          </button>
        </div>
      )}

      {/* Verification Evidence Cards */}
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No verification records matching this filter.
          </div>
        ) : (
          filteredTasks.map(task => {
            const v = task.verification;
            return (
              <div
                key={task.id}
                className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2.5 hover:border-slate-700 transition"
              >
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Method: <code className="text-indigo-400 font-mono">{v.method}</code>
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    v.status === 'PASS'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : v.status === 'FAIL'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : v.status === 'BLOCKED'
                      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {v.status}
                  </span>
                </div>

                {/* Expected Outcome */}
                <div className="text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block font-semibold mb-0.5 text-[11px]">
                    Expected Requirement:
                  </span>
                  <p className="text-slate-300 font-mono text-[11px]">
                    {v.expected}
                  </p>
                </div>

                {/* Recorded Evidence */}
                {v.evidence ? (
                  <div className="text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        Recorded Evidence:
                      </span>
                      <button
                        onClick={() => handleCopy(v.evidence, task.id)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        title="Copy evidence"
                      >
                        {copiedId === task.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <pre className="text-slate-200 font-mono text-[10px] bg-slate-950 p-2 rounded overflow-x-auto whitespace-pre-wrap border border-slate-900">
                      {v.evidence}
                    </pre>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic bg-slate-900/30 p-2 rounded">
                    Verification not performed yet. Task is pending in queue.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
