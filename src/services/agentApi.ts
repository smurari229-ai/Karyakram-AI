import { AgentSystemState, TaskItem, AgentConfig } from '../types/agent';

export async function fetchAgentStatus(): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/status');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch status');
  return json.data;
}

export async function startGoal(params: { goalTitle?: string; description?: string; repositoryUrl?: string; branch?: string }): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to start');
  return json.data;
}

export async function stepCycle(): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();
  return json.data;
}

export async function pauseAgent(): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/pause', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();
  return json.data;
}

export async function resumeAgent(): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();
  return json.data;
}

export async function stopAgent(): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/stop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();
  return json.data;
}

export async function approveTask(taskId: string, approved: boolean, reason?: string): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, approved, reason })
  });
  const json = await res.json();
  return json.data;
}

export async function addTask(task: Partial<TaskItem>): Promise<TaskItem> {
  const res = await fetch('/api/agent/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  const json = await res.json();
  return json.data;
}

export async function reorderTask(taskId: string, newPriority: 'high' | 'medium' | 'low'): Promise<TaskItem[]> {
  const res = await fetch('/api/agent/tasks/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, newPriority })
  });
  const json = await res.json();
  return json.data;
}

export async function updateConfig(config: Partial<AgentConfig>): Promise<AgentConfig> {
  const res = await fetch('/api/agent/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  const json = await res.json();
  return json.data;
}

export async function inspectGitHubRepo(repoUrl: string): Promise<any> {
  const res = await fetch('/api/agent/github-inspect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function restoreCheckpoint(checkpointId: string): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/checkpoints/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkpointId })
  });
  const json = await res.json();
  return json.data;
}

export async function resetSystem(): Promise<AgentSystemState> {
  const res = await fetch('/api/agent/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const json = await res.json();
  return json.data;
}
