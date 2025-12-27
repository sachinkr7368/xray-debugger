// X-Ray Core Library
// Fluent API for capturing decision context in multi-step processes

import { v4 as uuidv4 } from 'uuid';
import type { XRayTrace, XRayStep, XRayCandidate, XRayFilter } from './types';

type StepType = XRayStep['type'];

class XRayStepBuilder {
  private step: Partial<XRayStep>;
  private startTime: number;
  private trace: XRayTraceBuilder;

  constructor(trace: XRayTraceBuilder, name: string, type: StepType = 'custom') {
    this.trace = trace;
    this.startTime = Date.now();
    this.step = {
      id: uuidv4(),
      name,
      type,
      timestamp: new Date().toISOString(),
      input: { data: {} },
      output: { data: {} },
      reasoning: '',
    };
  }

  input(data: Record<string, unknown>, description?: string): this {
    this.step.input = { data, description };
    return this;
  }

  output(data: Record<string, unknown>, description?: string): this {
    this.step.output = { data, description };
    return this;
  }

  reasoning(text: string): this {
    this.step.reasoning = text;
    return this;
  }

  filters(filters: XRayFilter[]): this {
    this.step.filters = filters;
    return this;
  }

  candidates(candidates: XRayCandidate[]): this {
    this.step.candidates = candidates;
    return this;
  }

  metadata(data: Record<string, unknown>): this {
    this.step.metadata = { ...this.step.metadata, ...data };
    return this;
  }

  end(): XRayTraceBuilder {
    this.step.duration = Date.now() - this.startTime;
    this.trace.addStep(this.step as XRayStep);
    return this.trace;
  }
}

class XRayTraceBuilder {
  private trace: Partial<XRayTrace>;
  private startTime: number;
  private onComplete?: (trace: XRayTrace) => void | Promise<void>;

  constructor(name: string, description?: string) {
    this.startTime = Date.now();
    this.trace = {
      id: uuidv4(),
      name,
      description,
      startTime: new Date().toISOString(),
      status: 'running',
      steps: [],
    };
  }

  step(name: string, type: StepType = 'custom'): XRayStepBuilder {
    return new XRayStepBuilder(this, name, type);
  }

  addStep(step: XRayStep): void {
    this.trace.steps = [...(this.trace.steps || []), step];
  }

  metadata(data: Record<string, unknown>): this {
    this.trace.metadata = { ...this.trace.metadata, ...data };
    return this;
  }

  onEnd(callback: (trace: XRayTrace) => void | Promise<void>): this {
    this.onComplete = callback;
    return this;
  }

  async end(result?: {
    success: boolean;
    summary: string;
    data?: Record<string, unknown>;
  }): Promise<XRayTrace> {
    this.trace.endTime = new Date().toISOString();
    this.trace.duration = Date.now() - this.startTime;
    this.trace.status = result?.success === false ? 'failed' : 'completed';
    this.trace.result = result;

    const finalTrace = this.trace as XRayTrace;

    if (this.onComplete) {
      await this.onComplete(finalTrace);
    }

    return finalTrace;
  }

  fail(error: string): Promise<XRayTrace> {
    return this.end({
      success: false,
      summary: error,
    });
  }

  getTrace(): Partial<XRayTrace> {
    return this.trace;
  }

  getId(): string {
    return this.trace.id!;
  }
}

// Main XRay class - entry point for the library
export class XRay {
  private static saveCallback?: (trace: XRayTrace) => void | Promise<void>;

  // Configure how traces should be saved
  static configure(options: {
    onTrace?: (trace: XRayTrace) => void | Promise<void>;
  }): void {
    this.saveCallback = options.onTrace;
  }

  // Start a new trace
  static trace(name: string, description?: string): XRayTraceBuilder {
    const builder = new XRayTraceBuilder(name, description);
    
    if (this.saveCallback) {
      builder.onEnd(this.saveCallback);
    }

    return builder;
  }
}

export { XRayTraceBuilder, XRayStepBuilder };
