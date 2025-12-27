"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Play, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TraceList, TraceDetail } from "@/components/dashboard";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTraceId = searchParams.get("trace");

  const [selectedTraceId, setSelectedTraceId] = useState<string | undefined>(
    initialTraceId || undefined
  );
  const [isRunning, setIsRunning] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (initialTraceId) {
      setSelectedTraceId(initialTraceId);
    }
  }, [initialTraceId]);

  const handleSelectTrace = (id: string) => {
    setSelectedTraceId(id);
    router.replace(`/dashboard?trace=${id}`, { scroll: false });
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const runDemo = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/demo/run", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setSelectedTraceId(data.traceId);
        router.replace(`/dashboard?trace=${data.traceId}`, { scroll: false });
        handleRefresh();
      }
    } catch (error) {
      console.error("Error running demo:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border/50 flex flex-col bg-card/30">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-xray-slate">
                <Zap className="w-4 h-4 text-background" />
              </div>
              <span className="font-bold tracking-tight">X-Ray</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Button
            onClick={runDemo}
            disabled={isRunning}
            size="sm"
            className="w-full bg-xray-slate hover:bg-xray-slate/90 text-background border-0"
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-2" />
                Run Demo Pipeline
              </>
            )}
          </Button>
        </div>

        {/* Trace List */}
        <ScrollArea className="flex-1 p-4">
          <TraceList
            key={refreshKey}
            selectedTraceId={selectedTraceId}
            onSelectTrace={handleSelectTrace}
            onRefresh={handleRefresh}
          />
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - sticky */}
        <header className="shrink-0 h-14 border-b border-border flex items-center px-6 bg-background">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Dashboard</span>
          </div>
        </header>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-5xl mx-auto">
            {selectedTraceId ? (
              <TraceDetail key={selectedTraceId} traceId={selectedTraceId} />
            ) : (
              <EmptyState onRunDemo={runDemo} isRunning={isRunning} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  onRunDemo,
  isRunning,
}: {
  onRunDemo: () => void;
  isRunning: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <div className="p-4 rounded-2xl bg-xray-slate/15 mb-6">
        <Zap className="w-12 h-12 text-xray-slate" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No trace selected</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Select a trace from the sidebar to view its details, or run the demo
        pipeline to create a new trace.
      </p>
      <Button
        onClick={onRunDemo}
        disabled={isRunning}
        className="bg-xray-slate hover:bg-xray-slate/90 text-background border-0"
      >
        {isRunning ? (
          <>
            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
            Running Pipeline...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Run Demo Pipeline
          </>
        )}
      </Button>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
