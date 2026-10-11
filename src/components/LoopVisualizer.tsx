import React from 'react';
import { 
  Eye, 
  Map, 
  ListOrdered, 
  Hammer, 
  CheckCheck, 
  FileCheck, 
  RefreshCw, 
  ArrowRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { LoopStage } from '../types/agent';

interface LoopVisualizerProps {
  currentStage: LoopStage;
  activeTaskTitle?: string;
  cycleCount: number;
}

const STAGES: { stage: LoopStage; label: string; icon: any; color: string; desc: string }[] = [
  {
    stage: 'OBSERVE',
    label: '1. Observe',
    icon: Eye,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    desc: 'Inspect environment, read files & current history'
  },
  {
    stage: 'PLAN',
    label: '2. Plan',
    icon: Map,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    desc: 'Decompose goal into small verifiable tasks'
  },
  {
    stage: 'PRIORITIZE',
    label: '3. Prioritize',
    icon: ListOrdered,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    desc: 'Select next atomic ready task & check dependencies'
  },
  {
    stage: 'ACT',
    label: '4. Act',
    icon: Hammer,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    desc: 'Execute authorized tools on dedicated feature branch'
  },
  {
    stage: 'VERIFY',
    label: '5. Verify',
    icon: CheckCheck,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    desc: 'Run tests & check real evidence (PASS/FAIL/BLOCKED)'
  },
  {
    stage: 'RECORD',
    label: '6. Record',
    icon: FileCheck,
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    desc: 'Save persistent checkpoint, decisions & lessons'
  },
  {
    stage: 'REPLAN',
    label: '7. Replan',
    icon: RefreshCw,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    desc: 'Diagnose failures, bounded retry, or safe pivot'
  }
];

export const LoopVisualizer: React.FC<LoopVisualizerProps> = ({
  currentStage,
  activeTaskTitle,
  cycleCount
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Autonomous Execution Loop (Bounded ₹0 Architecture)
            </h2>
            <p className="text-xs text-slate-400">
              Strict 7-phase cycle: Never assumes success, verifies actual output with PASS/FAIL evidence.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 self-end sm:self-auto">
          <span>Loop Cycle: <strong className="text-cyan-400 font-bold">#{cycleCount}</strong></span>
        </div>
      </div>

      {/* Horizontal Scroll on Mobile, Flex on Desktop */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {STAGES.map((s, idx) => {
          const isActive = currentStage === s.stage;
          const Icon = s.icon;
          return (
            <React.Fragment key={s.stage}>
              <div
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  isActive
                    ? `${s.color} ring-2 ring-indigo-500/40 shadow-md font-bold scale-[1.03]`
                    : 'bg-slate-950/60 text-slate-400 border-slate-800/80 opacity-75 hover:opacity-100'
                }`}
                title={s.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-spin-slow' : ''}`} />
                <span>{s.label}</span>
              </div>
              {idx < STAGES.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-700 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {activeTaskTitle && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-500 font-medium">Current Focus:</span>
          <span className="font-semibold text-cyan-300 truncate max-w-[280px] sm:max-w-md bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {activeTaskTitle}
          </span>
          <span className="ml-auto text-[11px] text-slate-500 hidden sm:inline">
            Status verified by direct evidence
          </span>
        </div>
      )}
    </div>
  );
};
