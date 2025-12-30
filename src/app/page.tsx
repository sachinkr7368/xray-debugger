'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Search,
  Filter,
  Trophy,
  ArrowRight,
  Play,
  Github,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResult, setDemoResult] = useState<{
    traceId: string;
    selectedCompetitor: {
      title: string;
      price: number;
      rating: number;
      reviews: number;
    };
  } | null>(null);

  const runDemo = async () => {
    setIsRunning(true);
    setDemoResult(null);

    try {
      const response = await fetch('/api/demo/run', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setDemoResult({
          traceId: data.traceId,
          selectedCompetitor: data.selectedCompetitor,
        });
      }
    } catch (error) {
      console.error('Error running demo:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background - subtle pattern only */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(oklch(0.5 0.05 280 / 0.08) 1px, transparent 1px),
                              linear-gradient(90deg, oklch(0.5 0.05 280 / 0.08) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-32">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-2 rounded-lg bg-xray-slate">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">X-Ray</span>
          </motion.div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-xray-slate">Debug</span> multi-step
                <br />
                decisions with
                <br />
                <span className="text-xray-mauve">clarity</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Traditional tracing tells you <em>what</em> happened. X-Ray shows you{' '}
                <strong>why</strong> decisions were made. See every step, every filter,
                every candidate—and understand the reasoning.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={runDemo}
                  disabled={isRunning}
                  size="lg"
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

                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="group">
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Demo result */}
              {demoResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Card className="border-xray-sage/50 bg-xray-sage/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-xray-sage shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">Pipeline Complete!</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Selected competitor:{' '}
                            <span className="text-foreground font-medium">
                              {demoResult.selectedCompetitor.title}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ${demoResult.selectedCompetitor.price.toFixed(2)} • {demoResult.selectedCompetitor.rating}★ • {demoResult.selectedCompetitor.reviews.toLocaleString()} reviews
                          </p>
                          <Link
                            href={`/dashboard?trace=${demoResult.traceId}`}
                            className="inline-flex items-center gap-1 text-xs text-xray-slate hover:underline mt-2"
                          >
                            View trace details
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Visual illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Pipeline visualization */}
                <div className="space-y-4">
                  {[
                    { icon: Sparkles, label: 'Keyword Generation', type: 'llm', desc: 'LLM extracts search terms' },
                    { icon: Search, label: 'Candidate Search', type: 'search', desc: '50 products found' },
                    { icon: Filter, label: 'Apply Filters', type: 'filter', desc: '12 candidates qualified' },
                    { icon: Sparkles, label: 'Relevance Check', type: 'llm', desc: '8 true competitors' },
                    { icon: Trophy, label: 'Rank & Select', type: 'rank', desc: 'Best match selected' },
                  ].map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-px h-8 bg-border ml-6" 
                             style={{ display: index === 0 ? 'none' : 'block' }} />
                      </div>
                      <div className={`
                        bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 border-l-4
                        ${step.type === 'llm' ? 'border-l-xray-mauve' : ''}
                        ${step.type === 'search' ? 'border-l-xray-slate' : ''}
                        ${step.type === 'filter' ? 'border-l-xray-gold' : ''}
                        ${step.type === 'rank' ? 'border-l-xray-sage' : ''}
                      `}>
                        <div className="flex items-center gap-3">
                          <div className={`
                            p-2 rounded-lg
                            ${step.type === 'llm' ? 'bg-xray-mauve/15 text-xray-mauve' : ''}
                            ${step.type === 'search' ? 'bg-xray-slate/15 text-xray-slate' : ''}
                            ${step.type === 'filter' ? 'bg-xray-gold/15 text-xray-gold' : ''}
                            ${step.type === 'rank' ? 'bg-xray-sage/15 text-xray-sage' : ''}
                          `}>
                            <step.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{step.label}</h3>
                            <p className="text-xs text-muted-foreground">{step.desc}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            What makes X-Ray different?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Go beyond traditional tracing. X-Ray captures the reasoning behind every decision
            in your multi-step pipelines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Decision Reasoning',
              description: 'See not just what happened, but why each decision was made at every step.',
              icon: Sparkles,
              color: 'xray-mauve',
            },
            {
              title: 'Candidate Tracking',
              description: 'Follow every candidate through filters, understand why each passed or failed.',
              icon: Filter,
              color: 'xray-gold',
            },
            {
              title: 'Pipeline Visibility',
              description: 'Visualize the complete flow from input to output with step-by-step breakdown.',
              icon: Zap,
              color: 'xray-slate',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-border transition-colors bg-card/50">
                <CardContent className="p-6">
                  <div className={`p-3 rounded-lg w-fit mb-4 ${
                    feature.color === 'xray-mauve' ? 'bg-xray-mauve/15 text-xray-mauve' :
                    feature.color === 'xray-gold' ? 'bg-xray-gold/15 text-xray-gold' :
                    'bg-xray-slate/15 text-xray-slate'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>X-Ray Dashboard</span>
            </div>
            <a
              href="https://github.com/sachinkr7368/xray-debugger"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
