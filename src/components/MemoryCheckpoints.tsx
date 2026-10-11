import React, { useState } from 'react';
import { 
  Database, 
  RotateCcw, 
  Bookmark, 
  Lightbulb, 
  ShieldAlert, 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { AgentCheckpoint, LearnedLesson, SecurityAuditEntry } from '../types/agent';

interface MemoryCheckpointsProps {
  checkpoints: AgentCheckpoint[];
  lessons: LearnedLesson[];
  securityAudits: SecurityAuditEntry[];
  onRestoreCheckpoint: (checkpointId: string) => void;
  isLoading: boolean;
}

export const MemoryCheckpoints: React.FC<MemoryCheckpointsProps> = ({
  checkpoints,
  lessons,
  securityAudits,
  onRestoreCheckpoint,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'checkpoints' | 'lessons' | 'security'>('checkpoints');

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              Persistent Memory & Recovery Checkpoints
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Rules #5 & #9: Non-volatile storage saves state, decisions, and resume checkpoints.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('checkpoints')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'checkpoints'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Checkpoints ({checkpoints.length})
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'lessons'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Learned Rules ({lessons.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Security Audit ({securityAudits.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Checkpoints */}
      {activeTab === 'checkpoints' && (
        <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="bg-indigo-950/30 border border-indigo-500/20 p-2.5 rounded-xl text-xs text-indigo-300 flex items-center gap-2 mb-2">
            <Bookmark className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Resume Guarantee:</strong> If the phone browser tab closes or device sleeps, the agent can resume from any checkpoint without re-running passed tasks.
            </span>
          </div>

          {checkpoints.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No checkpoints recorded yet.
            </div>
          ) : (
            checkpoints.map((cp, idx) => {
              const timeStr = new Date(cp.timestamp).toLocaleString();
              return (
                <div
                  key={cp.id}
                  className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {idx === 0 ? '🟢 Latest Checkpoint' : `Checkpoint #${checkpoints.length - idx}`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{timeStr}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                      {cp.reason}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-mono">
                        {cp.completedTasks}/{cp.totalTasks} tasks verified
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-400 font-mono flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {cp.branchName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRestoreCheckpoint(cp.id)}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold active:scale-95 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore State</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Learned Rules & Lessons */}
      {activeTab === 'lessons' && (
        <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-300 flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Self-Learning:</strong> Rules discovered during audits and test runs are permanently memorized so past mistakes are not repeated.
            </span>
          </div>

          {lessons.map(lesson => (
            <div
              key={lesson.id}
              className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  {lesson.topic}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(lesson.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {lesson.rule}
              </p>
              <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                Evidence: {lesson.evidence}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Security Audits */}
      {activeTab === 'security' && (
        <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Least Privilege Audit Log:</strong> Every action undergoes security validation. High-risk write operations are strictly gated.
            </span>
          </div>

          {securityAudits.map(audit => (
            <div
              key={audit.id}
              className="bg-slate-950 rounded-xl border border-slate-800 p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{audit.action}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  audit.status === 'ALLOWED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : audit.status === 'GATED'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {audit.status} ({audit.riskLevel})
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{audit.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
