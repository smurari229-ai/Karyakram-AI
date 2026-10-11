import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchAgentStatus, 
  startGoal, 
  pauseAgent, 
  resumeAgent, 
  stepCycle, 
  stopAgent, 
  resetSystem, 
  approveTask, 
  reorderTask, 
  updateConfig, 
  restoreCheckpoint,
  addTask
} from './services/agentApi';
import { AgentSystemState, TaskPriority } from './types/agent';
import { Header } from './components/Header';
import { LoopVisualizer } from './components/LoopVisualizer';
import { ApprovalBanner } from './components/ApprovalBanner';
import { TaskQueue } from './components/TaskQueue';
import { VerificationPanel } from './components/VerificationPanel';
import { LiveConsole } from './components/LiveConsole';
import { MemoryCheckpoints } from './components/MemoryCheckpoints';
import { HinglishGuide } from './components/HinglishGuide';
import { NewGoalModal } from './components/NewGoalModal';
import { ConfigModal } from './components/ConfigModal';

import { 
  LayoutDashboard, 
  ListTodo, 
  ShieldCheck, 
  Database, 
  Smartphone, 
  GitBranch, 
  ExternalLink,
  Zap,
  Info,
  Terminal,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AgentSystemState | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'tasks' | 'qa' | 'memory' | 'guide'>('cockpit');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial status
  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchAgentStatus();
      setState(data);
    } catch (err) {
      console.error('Error fetching agent status:', err);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Periodic polling & autonomous execution loop runner
  useEffect(() => {
    const pollTime = state?.config.batterySaver ? 6000 : 2500;

    const interval = setInterval(async () => {
      try {
        const data = await fetchAgentStatus();
        setState(data);

        // If agent is running and not waiting for approval, drive the next cycle
        if (data.agentState === 'running' && !data.pendingApproval) {
          try {
            await stepCycle();
            const refreshed = await fetchAgentStatus();
            setState(refreshed);
          } catch (cycleErr) {
            console.error('Cycle execution failed:', cycleErr);
          }
        }
      } catch (e) {
        // quiet catch
      }
    }, pollTime);

    return () => clearInterval(interval);
  }, [state?.agentState, state?.pendingApproval, state?.config.batterySaver]);

  // Notification audio / alert when waiting for approval
  useEffect(() => {
    if (state?.pendingApproval && lastNotification !== state.pendingApproval.id) {
      setLastNotification(state.pendingApproval.id);
      // Try web notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Karyakram AI: Approval Needed', {
          body: `Sensitive operation "${state.pendingApproval.title}" requires your consent.`
        });
      }
    }
  }, [state?.pendingApproval, lastNotification]);

  // Handlers
  const handleStart = async () => {
    setLoading(true);
    try {
      const updated = await startGoal({});
      setState(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to start');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      const updated = await pauseAgent();
      setState(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      const updated = await resumeAgent();
      setState(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStep = async () => {
    setLoading(true);
    try {
      const updated = await stepCycle();
      setState(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      const updated = await stopAgent();
      setState(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all tasks, logs, and checkpoints back to initial clean demo state?')) return;
    setLoading(true);
    try {
      const updated = await resetSystem();
      setState(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (taskId: string, approved: boolean, reason?: string) => {
    setLoading(true);
    try {
      const updated = await approveTask(taskId, approved, reason);
      setState(updated);
    } catch (err: any) {
      alert(err.message || 'Approval action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderPriority = async (taskId: string, newPriority: TaskPriority) => {
    try {
      const updatedTasks = await reorderTask(taskId, newPriority);
      if (state) {
        setState({ ...state, tasks: updatedTasks });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleNewGoalSubmit = async (params: { goalTitle: string; description: string; repositoryUrl: string; branch: string }) => {
    setLoading(true);
    try {
      const updated = await startGoal(params);
      setState(updated);
      setActiveTab('cockpit');
    } catch (err: any) {
      alert(err.message || 'Failed to submit goal');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (configUpdate: any) => {
    try {
      const saved = await updateConfig(configUpdate);
      if (state) {
        setState({ ...state, config: saved });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRestoreCheckpoint = async (checkpointId: string) => {
    setLoading(true);
    try {
      const updated = await restoreCheckpoint(checkpointId);
      setState(updated);
      alert('Checkpoint restored! Resumed state successfully.');
    } catch (err: any) {
      alert(err.message || 'Restore failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTaskPrompt = async () => {
    const title = window.prompt('Enter task title:');
    if (!title) return;
    const desc = window.prompt('Enter task description / expected outcome:') || '';
    try {
      await addTask({
        title,
        description: desc,
        priority: 'medium',
        requiresApproval: false,
        tool: 'run_verification_test'
      });
      loadStatus();
    } catch (e: any) {
      alert(e.message || 'Failed to add task');
    }
  };

  const activeTask = state?.tasks.find(t => t.id === state?.activeTaskId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        state={state}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStep={handleStep}
        onStop={handleStop}
        onReset={handleReset}
        onOpenNewGoal={() => setShowNewGoalModal(true)}
        onOpenConfig={() => setShowConfigModal(true)}
        isLoading={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 pb-24 sm:pb-8">
        {/* Pending Approval Banner if gated task is waiting */}
        {state?.pendingApproval && (
          <ApprovalBanner
            task={state.pendingApproval}
            onApprove={handleApprove}
            isLoading={loading}
          />
        )}

        {/* Active Goal Strip */}
        {state?.goal && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  Active Goal
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  Branch: <strong className="text-emerald-300">{state.goal.branch}</strong>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100">
                {state.goal.title}
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl line-clamp-1 sm:line-clamp-none">
                {state.goal.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono">
              <a
                href={state.goal.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
              >
                <span>Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Budget: ₹0.00
              </span>
            </div>
          </div>
        )}

        {/* 7-Stage Autonomous Loop Visualizer */}
        <LoopVisualizer
          currentStage={state?.currentStage || 'OBSERVE'}
          activeTaskTitle={activeTask?.title}
          cycleCount={state?.cycleCount || 0}
        />

        {/* Mobile Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'cockpit'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tasks ({state?.tasks.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'qa'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>QA Tests ({state?.metrics.totalPassedTests || 0} PASS)</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'memory'
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Memory & CP ({state?.checkpoints.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold shadow-md'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Hinglish Guide</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'cockpit' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Task Queue Overview */}
            <TaskQueue
              tasks={state?.tasks || []}
              activeTaskId={state?.activeTaskId || null}
              onReorderPriority={handleReorderPriority}
              onAddTask={handleAddTaskPrompt}
              isLoading={loading}
            />

            {/* Right: Live Action Log Console */}
            <LiveConsole logs={state?.logs || []} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <TaskQueue
            tasks={state?.tasks || []}
            activeTaskId={state?.activeTaskId || null}
            onReorderPriority={handleReorderPriority}
            onAddTask={handleAddTaskPrompt}
            isLoading={loading}
          />
        )}

        {activeTab === 'qa' && (
          <VerificationPanel
            tasks={state?.tasks || []}
            onRunStep={handleStep}
            isLoading={loading}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryCheckpoints
            checkpoints={state?.checkpoints || []}
            lessons={state?.lessons || []}
            securityAudits={state?.securityAudits || []}
            onRestoreCheckpoint={handleRestoreCheckpoint}
            isLoading={loading}
          />
        )}

        {activeTab === 'guide' && (
          <HinglishGuide
            onSelectPresetGoal={preset => {
              handleNewGoalSubmit({
                goalTitle: preset.title,
                description: preset.description,
                repositoryUrl: preset.repoUrl,
                branch: 'agent/audit-and-fix'
              });
            }}
          />
        )}
      </main>

      {/* Modals */}
      <NewGoalModal
        isOpen={showNewGoalModal}
        onClose={() => setShowNewGoalModal(false)}
        onSubmit={handleNewGoalSubmit}
        isLoading={loading}
      />

      {state && (
        <ConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          config={state.config}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}
