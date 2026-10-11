export type LoopStage = 
  | 'OBSERVE' 
  | 'PLAN' 
  | 'PRIORITIZE' 
  | 'ACT' 
  | 'VERIFY' 
  | 'RECORD' 
  | 'REPLAN';

export type AgentState = 
  | 'idle' 
  | 'running' 
  | 'paused' 
  | 'waiting_approval' 
  | 'completed' 
  | 'blocked' 
  | 'failed';

export type VerificationStatus = 'PASS' | 'FAIL' | 'NOT_RUN' | 'BLOCKED';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked';

export interface VerificationRecord {
  expected: string;
  method: string;
  status: VerificationStatus;
  evidence: string;
  timestamp: string;
}

export interface TaskItem {
  id: string;
  goalId: string;
  title: string;
  description: string;
  stage: LoopStage;
  priority: TaskPriority;
  status: TaskStatus;
  retryCount: number;
  maxRetries: number;
  dependencies: string[];
  tool: string;
  toolArgs?: Record<string, any>;
  verification: VerificationRecord;
  requiresApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  resultSummary?: string;
  errorReason?: string;
  branchName?: string;
}

export interface AgentActionLog {
  id: string;
  timestamp: string;
  stage: LoopStage;
  taskId?: string;
  tool: string;
  inputDescription: string;
  outputSummary: string;
  evidence: string;
  status: 'success' | 'failure' | 'blocked' | 'skipped';
  cost: string; // ₹0.00 Verified
}

export interface AgentCheckpoint {
  id: string;
  timestamp: string;
  goalTitle: string;
  completedTasks: number;
  totalTasks: number;
  activeTaskId?: string;
  branchName: string;
  reason: string;
  stateSnapshot: {
    status: AgentState;
    currentStage: LoopStage;
  };
}

export interface LearnedLesson {
  id: string;
  timestamp: string;
  topic: string;
  rule: string;
  evidence: string;
}

export interface AgentGoal {
  id: string;
  title: string;
  description: string;
  repositoryUrl: string;
  branch: string;
  status: AgentState;
  createdAt: string;
  updatedAt: string;
  constraints: string[];
  budget: string; // "₹0.00"
}

export interface AgentConfig {
  maxRetries: number;
  maxCyclesPerRun: number;
  autoApproveReadOnly: boolean;
  requireApprovalForPr: boolean;
  requireApprovalForWrite: boolean;
  model: string;
  batterySaver: boolean;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ALLOWED' | 'GATED' | 'BLOCKED';
  reason: string;
}

export interface AgentSystemState {
  goal: AgentGoal | null;
  agentState: AgentState;
  currentStage: LoopStage;
  cycleCount: number;
  tasks: TaskItem[];
  activeTaskId: string | null;
  logs: AgentActionLog[];
  checkpoints: AgentCheckpoint[];
  lessons: LearnedLesson[];
  securityAudits: SecurityAuditEntry[];
  config: AgentConfig;
  pendingApproval: TaskItem | null;
  metrics: {
    totalPassedTests: number;
    totalFailedTests: number;
    totalBlocked: number;
    zeroCostSpent: string;
    branchWorkedOn: string;
  };
}
