import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Github, 
  GitBranch, 
  ShieldCheck, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { inspectGitHubRepo } from '../services/agentApi';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: { goalTitle: string; description: string; repositoryUrl: string; branch: string }) => void;
  isLoading: boolean;
}

export const NewGoalModal: React.FC<NewGoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [goalTitle, setGoalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('https://github.com/public-demo/autonomous-project');
  const [branch, setBranch] = useState('agent/audit-and-fix');
  const [inspecting, setInspecting] = useState(false);
  const [repoDetails, setRepoDetails] = useState<any | null>(null);
  const [inspectError, setInspectError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInspect = async () => {
    if (!repositoryUrl) return;
    setInspecting(true);
    setInspectError(null);
    try {
      const details = await inspectGitHubRepo(repositoryUrl);
      setRepoDetails(details);
      if (!goalTitle) {
        setGoalTitle(`Autonomous Audit & CI for ${details.name}`);
      }
      if (!description) {
        setDescription(`Verify dependencies, static types, and CI workflow for ${details.name}`);
      }
      if (details.recommendedBranch) {
        setBranch(details.recommendedBranch);
      }
    } catch (err: any) {
      setInspectError(err.message || 'Inspection failed');
    } finally {
      setInspecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    onSubmit({
      goalTitle: goalTitle.trim(),
      description: description.trim() || 'Autonomous engineering goal requested from Android dashboard',
      repositoryUrl: repositoryUrl.trim(),
      branch: branch.trim() || 'agent/work-branch'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Submit Autonomous Engineering Goal
              </h3>
              <p className="text-xs text-slate-400">
                ₹0 budget verified • Branch safe isolation
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Public GitHub Repo URL */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-cyan-400" />
                Target Repository URL (Public / ₹0 tokenless)
              </span>
              <button
                type="button"
                onClick={handleInspect}
                disabled={inspecting || !repositoryUrl}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-[11px]"
              >
                {inspecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                Live Inspect
              </button>
            </label>
            <input
              type="text"
              value={repositoryUrl}
              onChange={e => setRepositoryUrl(e.target.value)}
              placeholder="e.g. https://github.com/owner/repository"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          {/* Inspection Card if available */}
          {repoDetails && (
            <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {repoDetails.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ★ {repoDetails.stars} stars
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {repoDetails.description}
              </p>
              <div className="flex flex-wrap gap-1 text-[10px] font-mono text-cyan-300 pt-1">
                <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  Lang: {repoDetails.language}
                </span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  Default Branch: {repoDetails.defaultBranch}
                </span>
                <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-emerald-400">
                  Workflows: {repoDetails.workflowsDetected}
                </span>
              </div>
            </div>
          )}

          {inspectError && (
            <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{inspectError}</span>
            </div>
          )}

          {/* Goal Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              High-Level Objective / Goal Title
            </label>
            <input
              type="text"
              value={goalTitle}
              onChange={e => setGoalTitle(e.target.value)}
              placeholder="e.g. Audit dependencies, fix security risks & add CI workflow"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Detailed Scope & Verification Criteria
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe constraints, expected test passing criteria, and specific deliverables..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          {/* Dedicated Feature Branch */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              Isolated Feature Branch (Never main)
            </label>
            <input
              type="text"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              placeholder="agent/feature-branch-name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Safety rule: Direct commits to main are blocked. All changes live on this branch.
            </p>
          </div>

          {/* Hard Constraints Box */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
            <span className="text-slate-300 font-bold block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Active System Guardrails:
            </span>
            <p>✓ Zero Cost: Strictly free tier APIs and tools (₹0.00)</p>
            <p>✓ QA Evidence: Every task verified with PASS/FAIL before PR</p>
            <p>✓ Approval Gate: Pull request creation requires explicit tap</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !goalTitle.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
            >
              Launch Autonomous Loop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
