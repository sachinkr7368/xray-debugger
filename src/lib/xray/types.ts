// X-Ray Core Types
// General-purpose types for capturing decision context in multi-step processes

export interface XRayStepEvaluation {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  value?: unknown;
}

export interface XRayCandidate {
  id: string;
  label: string;
  metrics: Record<string, unknown>;
  evaluations?: XRayStepEvaluation[];
  qualified: boolean;
  selected?: boolean;
}

export interface XRayFilter {
  name: string;
  rule: string;
  value: unknown;
}

export interface XRayStep {
  id: string;
  name: string;
  type: 'transform' | 'filter' | 'llm' | 'search' | 'rank' | 'custom';
  timestamp: string;
  duration: number;
  input: {
    description?: string;
    data: Record<string, unknown>;
  };
  output: {
    description?: string;
    data: Record<string, unknown>;
  };
  reasoning: string;
  filters?: XRayFilter[];
  candidates?: XRayCandidate[];
  metadata?: Record<string, unknown>;
}

export interface XRayTrace {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: 'running' | 'completed' | 'failed';
  steps: XRayStep[];
  metadata?: Record<string, unknown>;
  result?: {
    success: boolean;
    summary: string;
    data?: Record<string, unknown>;
  };
}

export interface XRayTraceListItem {
  id: string;
  name: string;
  status: XRayTrace['status'];
  startTime: string;
  duration?: number;
  stepsCount: number;
}
