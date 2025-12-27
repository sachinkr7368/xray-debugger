'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Trophy, 
  Zap, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { XRayTraceListItem } from '@/lib/xray';

const stepTypeIcons = {
  llm: Sparkles,
  search: Search,
  filter: Filter,
  rank: Trophy,
  transform: Zap,
  custom: Zap,
};

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'text-xray-sage bg-xray-sage/10',
  },
  running: {
    icon: RefreshCw,
    label: 'Running',
    className: 'text-xray-gold bg-xray-gold/10 animate-spin',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    className: 'text-xray-coral bg-xray-coral/10',
  },
};

interface TraceListProps {
  selectedTraceId?: string;
  onSelectTrace: (id: string) => void;
  onRefresh: () => void;
}

export function TraceList({ selectedTraceId, onSelectTrace, onRefresh }: TraceListProps) {
  const [traces, setTraces] = useState<XRayTraceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraces = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/traces');
      if (!response.ok) throw new Error('Failed to fetch traces');
      const data = await response.json();
      setTraces(data.traces || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load traces');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraces();
  }, [fetchTraces]);

  const handleRefresh = () => {
    fetchTraces();
    onRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">{error}</span>
        <button 
          onClick={handleRefresh}
          className="text-xs text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (traces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
        <Search className="w-5 h-5" />
        <span className="text-sm">No traces yet</span>
        <span className="text-xs">Run a demo to create your first trace</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Recent Traces
        </span>
        <button
          onClick={handleRefresh}
          className="p-1 rounded hover:bg-secondary transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      
      {traces.map((trace, index) => {
        const status = statusConfig[trace.status];
        const StatusIcon = status.icon;
        
        return (
          <motion.button
            key={trace.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectTrace(trace.id)}
            className={cn(
              'w-full text-left p-3 rounded-lg transition-all duration-200',
              'hover:bg-secondary/80 group',
              selectedTraceId === trace.id
                ? 'bg-secondary ring-1 ring-primary/20'
                : 'bg-transparent'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'p-1 rounded',
                    status.className
                  )}>
                    <StatusIcon className="w-3 h-3" />
                  </span>
                  <span className="font-medium text-sm truncate">
                    {trace.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(trace.startTime), 'HH:mm:ss')}
                  </span>
                  <span>
                    {trace.stepsCount} steps
                  </span>
                  {trace.duration && (
                    <span>
                      {trace.duration}ms
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                selectedTraceId === trace.id && 'transform rotate-90'
              )} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export function TraceListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-secondary/50 animate-pulse"
        >
          <div className="h-4 w-3/4 bg-muted rounded mb-2" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
