"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Sparkles,
  Search,
  Filter,
  Trophy,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { XRayTrace, XRayStep, XRayCandidate } from "@/lib/xray";

const stepTypeConfig = {
  llm: {
    icon: Sparkles,
    label: "LLM",
    color: "text-xray-mauve",
    bgColor: "bg-xray-mauve/10",
    borderColor: "border-xray-mauve",
  },
  search: {
    icon: Search,
    label: "Search",
    color: "text-xray-slate",
    bgColor: "bg-xray-slate/10",
    borderColor: "border-xray-slate",
  },
  filter: {
    icon: Filter,
    label: "Filter",
    color: "text-xray-gold",
    bgColor: "bg-xray-gold/10",
    borderColor: "border-xray-gold",
  },
  rank: {
    icon: Trophy,
    label: "Rank",
    color: "text-xray-sage",
    bgColor: "bg-xray-sage/10",
    borderColor: "border-xray-sage",
  },
  transform: {
    icon: Zap,
    label: "Transform",
    color: "text-xray-coral",
    bgColor: "bg-xray-coral/10",
    borderColor: "border-xray-coral",
  },
  custom: {
    icon: Zap,
    label: "Custom",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-muted-foreground",
  },
};

interface TraceDetailProps {
  traceId: string;
}

export function TraceDetail({ traceId }: TraceDetailProps) {
  const [trace, setTrace] = useState<XRayTrace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTrace() {
      try {
        setLoading(true);
        const response = await fetch(`/api/traces/${traceId}`);
        if (!response.ok) throw new Error("Failed to fetch trace");
        const data = await response.json();
        setTrace(data.trace);
        // Expand all steps by default
        setExpandedSteps(data.trace.steps.map((s: XRayStep) => s.id));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trace");
      } finally {
        setLoading(false);
      }
    }

    fetchTrace();
  }, [traceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !trace) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
        <XCircle className="w-8 h-8" />
        <span>{error || "Trace not found"}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{trace.name}</h1>
            {trace.description && (
              <p className="text-muted-foreground mt-1">{trace.description}</p>
            )}
          </div>
          <Badge
            variant={
              trace.status === "completed"
                ? "default"
                : trace.status === "failed"
                ? "destructive"
                : "secondary"
            }
            className="text-sm"
          >
            {trace.status}
          </Badge>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {format(new Date(trace.startTime), "PPpp")}
          </span>
          {trace.duration && (
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              {trace.duration}ms total
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            {trace.steps.length} steps
          </span>
        </div>
      </div>

      <Separator />

      {/* Pipeline Flow */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Pipeline Flow</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {trace.steps.map((step, index) => {
            const config = stepTypeConfig[step.type];
            const Icon = config.icon;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg glass",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {step.name}
                  </span>
                </motion.div>
                {index < trace.steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Steps Detail */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Step Details</h2>
        <Accordion
          type="multiple"
          value={expandedSteps}
          onValueChange={setExpandedSteps}
          className="space-y-4"
        >
          {trace.steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </Accordion>
      </div>

      {/* Result */}
      {trace.result && (
        <>
          <Separator />
          <Card
            className={cn(
              "glass",
              trace.result.success
                ? "border-xray-sage/30"
                : "border-xray-coral/30"
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {trace.result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-xray-sage" />
                ) : (
                  <XCircle className="w-5 h-5 text-xray-coral" />
                )}
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {trace.result.summary}
              </p>
              {trace.result.data && <DataViewer data={trace.result.data} />}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}

function StepCard({ step, index }: { step: XRayStep; index: number }) {
  const config = stepTypeConfig[step.type];
  const Icon = config.icon;

  return (
    <AccordionItem
      value={step.id}
      className={cn(
        "glass rounded-lg overflow-hidden border-l-4",
        config.borderColor
      )}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50">
        <div className="flex items-center gap-3 text-left">
          <div className={cn("p-2 rounded-lg", config.bgColor)}>
            <Icon className={cn("w-4 h-4", config.color)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Step {index + 1}
              </span>
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
            </div>
            <h3 className="font-semibold">{step.name}</h3>
          </div>
          <div className="text-xs text-muted-foreground">{step.duration}ms</div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-6 pt-2">
          {/* Reasoning Banner */}
          <div className="bg-xray-mauve/10 rounded-lg p-4 border border-xray-mauve/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-xray-mauve shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider text-xray-mauve font-medium">
                  Reasoning
                </span>
                <p className="mt-1 text-sm">{step.reasoning}</p>
              </div>
            </div>
          </div>

          {/* Input/Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 rotate-180" />
                Input
              </span>
              {step.input.description && (
                <p className="text-xs text-muted-foreground">
                  {step.input.description}
                </p>
              )}
              <DataViewer data={step.input.data} />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3" />
                Output
              </span>
              {step.output.description && (
                <p className="text-xs text-muted-foreground">
                  {step.output.description}
                </p>
              )}
              <DataViewer data={step.output.data} />
            </div>
          </div>

          {/* Filters */}
          {step.filters && step.filters.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                <Filter className="w-3 h-3" />
                Filters Applied
              </span>
              <div className="flex flex-wrap gap-2">
                {step.filters.map((filter, i) => (
                  <div
                    key={i}
                    className="bg-xray-gold/10 border border-xray-gold/20 rounded-lg px-3 py-2"
                  >
                    <span className="font-medium text-sm">{filter.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {filter.rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Candidates */}
          {step.candidates && step.candidates.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                <Package className="w-3 h-3" />
                Candidates Evaluated ({step.candidates.length})
              </span>
              <CandidateList candidates={step.candidates} />
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function CandidateList({ candidates }: { candidates: XRayCandidate[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayCandidates = showAll ? candidates : candidates.slice(0, 5);
  const hasMore = candidates.length > 5;

  return (
    <div className="space-y-2">
      <ScrollArea className="h-auto max-h-96">
        <div className="space-y-2">
          {displayCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                "rounded-lg border p-3 transition-all",
                candidate.selected
                  ? "bg-xray-sage/10 border-xray-sage/30"
                  : candidate.qualified
                  ? "bg-secondary/50 border-border"
                  : "bg-xray-coral/5 border-xray-coral/20 opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {candidate.qualified ? (
                      <CheckCircle2 className="w-4 h-4 text-xray-sage flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-xray-coral flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm truncate">
                      {candidate.label}
                    </span>
                    {candidate.selected && (
                      <Badge className="bg-xray-sage text-white text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(candidate.metrics).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-xs bg-secondary px-2 py-1 rounded"
                      >
                        {key}: {formatValue(value)}
                      </span>
                    ))}
                  </div>

                  {/* Evaluations */}
                  {candidate.evaluations &&
                    candidate.evaluations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {candidate.evaluations.map((evaluation) => (
                          <div
                            key={evaluation.id}
                            className={cn(
                              "text-xs flex items-center gap-1.5",
                              evaluation.passed
                                ? "text-xray-sage"
                                : "text-xray-coral"
                            )}
                          >
                            {evaluation.passed ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span className="font-medium">
                              {evaluation.label}:
                            </span>
                            <span className="text-muted-foreground">
                              {evaluation.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-sm text-primary hover:underline py-2"
        >
          {showAll ? "Show less" : `Show ${candidates.length - 5} more`}
        </button>
      )}
    </div>
  );
}

function DataViewer({ data }: { data: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const entries = Object.entries(data);
  const isLarge = entries.length > 5 || JSON.stringify(data).length > 500;

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>;
    }
    if (typeof value === "boolean") {
      return (
        <span className={value ? "text-xray-sage" : "text-xray-coral"}>
          {value.toString()}
        </span>
      );
    }
    if (typeof value === "number") {
      return <span className="text-xray-gold">{value.toLocaleString()}</span>;
    }
    if (typeof value === "string") {
      if (value.length > 100 && !expanded) {
        return <span>&quot;{value.slice(0, 100)}...&quot;</span>;
      }
      return <span>&quot;{value}&quot;</span>;
    }
    if (Array.isArray(value)) {
      if (value.length === 0)
        return <span className="text-muted-foreground">[]</span>;
      if (value.length <= 3 || expanded) {
        return (
          <div className="pl-4 border-l border-border/50 space-y-1 mt-1">
            {value.map((item, i) => (
              <div key={i} className="text-xs">
                <span className="text-muted-foreground">[{i}]</span>{" "}
                {renderValue(item)}
              </div>
            ))}
          </div>
        );
      }
      return (
        <span className="text-muted-foreground">[{value.length} items]</span>
      );
    }
    if (typeof value === "object") {
      return (
        <div className="pl-4 border-l border-border/50 space-y-1 mt-1">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="text-xray-slate">{k}:</span> {renderValue(v)}
            </div>
          ))}
        </div>
      );
    }
    return <span>{String(value)}</span>;
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-sm font-mono overflow-x-auto">
      <div className="space-y-1">
        {entries.slice(0, expanded ? undefined : 5).map(([key, value]) => (
          <div key={key} className="text-xs">
            <span className="text-xray-slate">{key}:</span> {renderValue(value)}
          </div>
        ))}
      </div>
      {isLarge && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline mt-2"
        >
          {expanded ? "Collapse" : "Expand all"}
        </button>
      )}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    return value.toFixed(2);
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}
