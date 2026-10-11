import React, { useState } from 'react';
import { 
  Terminal, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Copy, 
  Check,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { AgentActionLog, LoopStage } from '../types/agent';

interface LiveConsoleProps {
  logs: AgentActionLog[];
}

export const LiveConsole: React.FC<LiveConsoleProps> = ({ logs }) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    if (selectedStage === 'ALL') return true;
    return log.stage === selectedStage;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
      case 'failure':
        return <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />;
      case 'blocked':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col h-full font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800 font-sans">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              Live Execution & Audit Stream
            </h2>
            <p className="text-xs text-slate-400">
              Transparent real-time tool logs, evidence verification, and cost tracking.
            </p>
          </div>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {(['ALL', 'OBSERVE', 'ACT', 'VERIFY', 'REPLAN'] as const).map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                selectedStage === stage
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-600 font-sans">
            No logs recorded yet. Run a step or start the autonomous loop.
          </div>
        ) : (
          filteredLogs.map(log => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div
                key={log.id}
                className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-3 hover:border-slate-700 transition"
              >
                {/* Top line */}
                <div className="flex items-center justify-between gap-2 text-[11px] mb-1.5 text-slate-400">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className="text-indigo-400 font-bold">[{log.stage}]</span>
                    <span className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {log.tool}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {log.cost}
                    </span>
                    <span className="text-slate-500">{timeStr}</span>
                  </div>
                </div>

                {/* Input / Action description */}
                <div className="text-slate-200 text-xs mb-1 font-sans font-medium">
                  {log.inputDescription}
                </div>

                {/* Output summary */}
                <div className="text-slate-400 text-[11px] mb-1.5 font-sans">
                  {log.outputSummary}
                </div>

                {/* Evidence block if available */}
                {log.evidence && (
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[10px] text-slate-300 relative group">
                    <div className="flex items-center justify-between text-slate-500 text-[9px] mb-1">
                      <span>EVIDENCE:</span>
                      <button
                        onClick={() => handleCopy(log.evidence, log.id)}
                        className="text-slate-500 hover:text-slate-300"
                        title="Copy"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono overflow-x-auto text-emerald-300/80">
                      {log.evidence}
                    </pre>
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
