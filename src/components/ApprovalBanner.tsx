import React from 'react';
import { AlertOctagon, CheckCircle2, XCircle, ShieldAlert, GitPullRequest, FileEdit } from 'lucide-react';
import { TaskItem } from '../types/agent';

interface ApprovalBannerProps {
  task: TaskItem;
  onApprove: (taskId: string, approved: boolean, reason?: string) => void;
  isLoading: boolean;
}

export const ApprovalBanner: React.FC<ApprovalBannerProps> = ({
  task,
  onApprove,
  isLoading
}) => {
  return (
    <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border-2 border-rose-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-pulse-subtle">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                Security Gate: Sensitive Action
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Least-Privilege Enforcement
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
              {task.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {task.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span className="bg-slate-950 px-2 py-1 rounded text-cyan-300 border border-slate-800 font-mono flex items-center gap-1">
                {task.tool.includes('pr') ? <GitPullRequest className="w-3.5 h-3.5" /> : <FileEdit className="w-3.5 h-3.5" />}
                Tool: {task.tool}
              </span>
              <span className="bg-slate-950 px-2 py-1 rounded text-emerald-400 border border-slate-800 font-mono">
                Target: {task.branchName || 'agent/work-branch'}
              </span>
              <span className="text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                Rule: Zero Direct Main Changes
              </span>
            </div>

            <p className="text-xs text-rose-300/90 mt-2 bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
              💡 <strong>Hinglish Guide:</strong> Agent sensitive operation (Pull Request ya Code Changes) karne se pehle aapki permission maang raha hai. Aap jab tak 'Approve' nahi karenge, tab tak aage nahi badhega.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => onApprove(task.id, false, 'User declined via dashboard')}
            disabled={isLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/40 text-xs sm:text-sm font-semibold active:scale-95 transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject / Skip</span>
          </button>
          <button
            onClick={() => onApprove(task.id, true, 'User approved via Android dashboard')}
            disabled={isLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs sm:text-sm font-semibold active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
