import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  ShieldCheck, 
  SlidersHorizontal, 
  Zap, 
  PlusCircle, 
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { AgentSystemState } from '../types/agent';

interface HeaderProps {
  state: AgentSystemState | null;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onStop: () => void;
  onReset: () => void;
  onOpenNewGoal: () => void;
  onOpenConfig: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
  onOpenNewGoal,
  onOpenConfig,
  isLoading
}) => {
  const agentStatus = state?.agentState || 'idle';

  const getStatusBadge = () => {
    switch (agentStatus) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Loop Active
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Pause className="w-3 h-3" />
            Paused
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-bounce">
            <AlertTriangle className="w-3 h-3" />
            Needs Approval
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Verified Complete
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <AlertTriangle className="w-3 h-3" />
            Blocked (Check Logs)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <Clock className="w-3 h-3" />
            Ready
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  Karyakram AI
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                    ₹0 Free
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-cyan-400" />
                Android-First Autonomous Engineering Agent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            {getStatusBadge()}
          </div>
        </div>

        {/* Center / Stats Chips on desktop */}
        <div className="hidden md:flex items-center gap-3">
          {getStatusBadge()}
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Budget: <strong className="text-emerald-400">₹0.00</strong> spent</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cycle: <strong>{state?.cycleCount || 0}</strong></span>
          </div>
        </div>

        {/* Quick Actions (Thumb friendly for Mobile) */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-1.5 sm:gap-2">
          {agentStatus === 'running' ? (
            <button
              onClick={onPause}
              disabled={isLoading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold active:scale-95 transition"
              title="Pause execution"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={agentStatus === 'paused' ? onResume : onStart}
              disabled={isLoading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 active:scale-95 transition"
              title="Run autonomous loop"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{agentStatus === 'paused' ? 'Resume' : 'Run Loop'}</span>
            </button>
          )}

          {/* 1-Step Manual Cycle (Perfect for Android inspection) */}
          <button
            onClick={onStep}
            disabled={isLoading || agentStatus === 'running'}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold active:scale-95 transition disabled:opacity-50"
            title="Execute exactly 1 cycle (Observe -> Act -> Verify)"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>1 Step</span>
          </button>

          {/* New Goal */}
          <button
            onClick={onOpenNewGoal}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold active:scale-95 transition"
            title="Create new goal"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Goal</span>
          </button>

          {/* Config Settings */}
          <button
            onClick={onOpenConfig}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 active:scale-95 transition"
            title="Settings & Resource Limits"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 active:scale-95 transition"
            title="Reset system state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
