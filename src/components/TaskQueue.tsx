import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  ArrowUp, 
  ArrowDown, 
  ShieldAlert, 
  ExternalLink, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  FileCheck2,
  GitBranch,
  Repeat2
} from 'lucide-react';
import { TaskItem, TaskPriority, VerificationStatus } from '../types/agent';

interface TaskQueueProps {
  tasks: TaskItem[];
  activeTaskId: string | null;
  onReorderPriority: (taskId: string, newPriority: TaskPriority) => void;
  onAddTask: () => void;
  isLoading: boolean;
}

export const TaskQueue: React.FC<TaskQueueProps> = ({
  tasks,
  activeTaskId,
  onReorderPriority,
  onAddTask,
  isLoading
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'issues'>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending' || task.status === 'in_progress';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'issues') return task.status === 'failed' || task.status === 'blocked';
    return true;
  });

  const getStatusIcon = (status: string, verificationStatus: VerificationStatus) => {
    if (status === 'completed' || verificationStatus === 'PASS') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (status === 'in_progress') {
      return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />;
    }
    if (status === 'failed' || verificationStatus === 'FAIL') {
      return <XCircle className="w-4 h-4 text-rose-400" />;
    }
    if (status === 'blocked' || verificationStatus === 'BLOCKED') {
      return <AlertTriangle className="w-4 h-4 text-purple-400" />;
    }
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">MED</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">LOW</span>;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTaskId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Top Bar with Filters & Add Task */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              Task Queue & Execution Plan
            </h2>
            <span className="text-xs font-mono bg-slate-950 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
              {tasks.filter(t => t.status === 'completed').length}/{tasks.length} Done
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Ordered by priority & verified dependency graph.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'pending', 'completed', 'issues'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition whitespace-nowrap ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={onAddTask}
            className="ml-auto sm:ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const isActive = activeTaskId === task.id;
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all ${
                  isActive
                    ? 'bg-slate-950 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                    : task.status === 'completed'
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-90'
                    : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(task.id)}
                  className="p-3 sm:p-3.5 cursor-pointer flex items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5 sm:mt-0 flex-shrink-0">
                      {getStatusIcon(task.status, task.verification.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                        <h4 className={`text-xs sm:text-sm font-semibold truncate ${
                          task.status === 'completed' ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-100'
                        }`}>
                          {task.title}
                        </h4>
                        {getPriorityBadge(task.priority)}
                        {task.requiresApproval && (
                          <span className="flex items-center gap-1 text-[10px] font-mono bg-rose-500/10 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20">
                            <ShieldAlert className="w-2.5 h-2.5" /> Gated
                          </span>
                        )}
                        {task.retryCount > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <Repeat2 className="w-2.5 h-2.5" /> Retry {task.retryCount}/{task.maxRetries}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  {/* Verification Status Pill & Accordion chevron */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      task.verification.status === 'PASS'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : task.verification.status === 'FAIL'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : task.verification.status === 'BLOCKED'
                        ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {task.verification.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-1 border-t border-slate-800/80 text-xs space-y-2 bg-slate-950/40">
                    {/* Tool & Branch */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-500 block mb-0.5">Execution Tool:</span>
                        <code className="text-cyan-300 font-mono">{task.tool}</code>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-slate-500 block mb-0.5">Feature Branch:</span>
                          <span className="text-emerald-400 font-mono flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {task.branchName || 'agent/work-branch'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Specification */}
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <FileCheck2 className="w-3 h-3 text-indigo-400" />
                          Expected Verification:
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Method: {task.verification.method}
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px]">
                        {task.verification.expected}
                      </p>
                      {task.verification.evidence && (
                        <div className="mt-2 pt-2 border-t border-slate-800">
                          <span className="text-slate-400 font-semibold block text-[11px] mb-0.5">
                            Recorded Direct Evidence:
                          </span>
                          <pre className="text-emerald-300/90 font-mono text-[10px] bg-slate-950 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                            {task.verification.evidence}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Priority Change Controls */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500">Change Priority:</span>
                      <div className="flex items-center gap-1">
                        {(['high', 'medium', 'low'] as const).map(p => (
                          <button
                            key={p}
                            disabled={isLoading}
                            onClick={() => onReorderPriority(task.id, p)}
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                              task.priority === p
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
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
