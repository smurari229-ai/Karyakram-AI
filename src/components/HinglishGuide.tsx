import React, { useState } from 'react';
import { 
  Smartphone, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Github, 
  Cpu, 
  Play, 
  Copy, 
  Check,
  Zap
} from 'lucide-react';

interface HinglishGuideProps {
  onSelectPresetGoal: (goal: { title: string; repoUrl: string; description: string }) => void;
}

export const HinglishGuide: React.FC<HinglishGuideProps> = ({ onSelectPresetGoal }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const PRESETS = [
    {
      title: 'Audit & Harden Public React Repo',
      repoUrl: 'https://github.com/public-demo/autonomous-project',
      description: 'Check package.json, verify zero vulnerabilities, and write verified GitHub Actions CI workflow without modifying main.',
      badge: 'Beginner Recommended'
    },
    {
      title: 'Zero-Cost Security & Secret Leak Scanner',
      repoUrl: 'https://github.com/public-demo/secure-node-app',
      description: 'Scan all configuration files and environment templates for hardcoded API keys, tokens, or dangerous script tags.',
      badge: 'Security Audit'
    },
    {
      title: 'Automated TypeScript Compilation & QA Test',
      repoUrl: 'https://github.com/public-demo/ts-library',
      description: 'Run static type-checking, verify module exports, and record PASS/FAIL evidence in persistent checkpoints.',
      badge: 'QA & Testing'
    }
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Android ₹0 Beginner Setup Guide (Hinglish)
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                100% Free
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Mobile phone se autonomous AI agent chalane ka bilkul simple aur zero-cost tareeqa.
            </p>
          </div>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[11px]">
              1
            </span>
            <span>Agent Kaam Kaise Karta Hai? (The Bounded Loop)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ye agent 7 steps follow karta hai: <strong>OBSERVE</strong> (files dekhna) → <strong>PLAN</strong> (kaam ko tukdon me todna) → <strong>PRIORITIZE</strong> (pehle zaroori kaam) → <strong>ACT</strong> (tool chalana) → <strong>VERIFY</strong> (actual test pass hua ya fail) → <strong>RECORD</strong> (memory save karna) → <strong>REPLAN</strong> (agar fail hua toh safe retry).
          </p>
          <div className="text-[11px] bg-slate-900 text-emerald-400 p-2 rounded border border-slate-800 font-mono">
            ✓ Rule: Har task ka result PASS ya FAIL hoga direct evidence ke saath!
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[11px]">
              2
            </span>
            <span>₹0 Zero-Cost Rule (Ek bhi rupiya nahi lagega)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aapko koi paid API key, subscription ya credit card daalne ki zaroorat nahi hai. Agent Google AI Studio ke free tier (Gemini 2.5/Flash), GitHub public repository API (bina token ke 60 req/hr), aur local disk memory ka use karta hai.
          </p>
          <div className="text-[11px] bg-slate-900 text-cyan-300 p-2 rounded border border-slate-800 font-mono">
            ✓ Strictly zero hidden cost. Budget hamesha ₹0.00 lock rahega.
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[11px]">
              3
            </span>
            <span>Android Phone Controls (Mobile Friendly)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Desktop laptop ya terminal kholne ki zaroorat nahi!
            <br />
            • <strong>'1 Step' button:</strong> Mobile par 1 cycle chala ke inspect karein.
            <br />
            • <strong>'Run Loop' button:</strong> Agent ko autonomous loop me continuously run karein.
            <br />
            • <strong>'Approval' popup:</strong> Koi bhi code change ya Pull Request banane se pehle aapse permission maangega.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[11px]">
              4
            </span>
            <span>Recovery & Checkpoint (Phone Band Hone Par Bhi Safe)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Agar mobile browser band ho jaye ya call aa jaye, toh ghabraiye mat! Agent har verified task ke baad <strong>Checkpoint</strong> save karta hai. Wapas aake <strong>'Resume'</strong> dabate hi wahin se aage badhega, puraana kaam dobara nahi karega.
          </p>
          <div className="text-[11px] bg-slate-900 text-indigo-300 p-2 rounded border border-slate-800 font-mono">
            ✓ Checkpoints tab me jaakar kisi bhi puraane state par restore kar sakte hain.
          </div>
        </div>
      </div>

      {/* Preset 1-Tap Goals for Beginners */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            1-Tap Preset Goals (Abhi Try Karein)
          </h3>
          <span className="text-[11px] text-slate-500">Android One-Tap Start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((preset, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col justify-between hover:border-cyan-500/50 transition group"
            >
              <div>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20">
                  {preset.badge}
                </span>
                <h4 className="text-xs font-bold text-slate-100 mt-2">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => onSelectPresetGoal(preset)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold active:scale-95 transition"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start This Goal</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Termux Optional Note for Advanced Users */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
        <h4 className="font-semibold text-slate-300 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Kya Android Termux ki zaroorat hai? (No / Optional)
        </h4>
        <p className="text-[11px] leading-relaxed">
          Nahi! Ye web dashboard seedha aapke mobile Chrome/Brave browser me chalta hai. Agar aap Termux use karna chahte hain toh kar sakte hain, lekin zaroori nahi hai. Saari planning, autonomous loop, aur GitHub audit isi screen se hoti hai.
        </p>
      </div>
    </div>
  );
};
