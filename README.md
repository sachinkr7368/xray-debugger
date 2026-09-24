# X-Ray: Debug Multi-Step Decisions with Clarity

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-Latest-000)](https://ui.shadcn.com/)

An **X-Ray library and dashboard** for debugging non-deterministic, multi-step algorithmic systems. Traditional tracing tells you _what_ happened — X-Ray shows you **why** decisions were made.

## 🎯 What is X-Ray?

X-Ray provides transparency into multi-step decision processes by capturing:

- **Decision Reasoning** — Not just inputs and outputs, but _why_ each decision was made
- **Candidate Tracking** — Follow every candidate through filters, understand pass/fail reasons
- **Pipeline Visibility** — Visualize the complete flow from input to final output

### X-Ray vs Traditional Tracing

| Aspect            | Traditional Tracing          | X-Ray                                |
| ----------------- | ---------------------------- | ------------------------------------ |
| Focus             | Performance & flow           | Decision reasoning                   |
| Data              | Spans, timing, service calls | Candidates, filters, selection logic |
| Question answered | "What happened?"             | "Why this output?"                   |
| Granularity       | Function/service level       | Business logic level                 |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/sachinkr7368/xray-debugger.git
cd xray-debugger

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running the Demo

1. Click **"Run Demo Pipeline"** on the landing page
2. Watch the pipeline execute (competitor selection for a water bottle)
3. Click **"View trace details"** to see the full X-Ray visualization
4. Explore each step's inputs, outputs, filters, and reasoning

## 📖 X-Ray Library Usage

### Basic Usage

```typescript
import { XRay, saveTrace } from '@/lib/xray';

// Configure where to save traces
XRay.configure({
  onTrace: async (trace) => {
    await saveTrace(trace);
  },
});

// Create a trace
const trace = XRay.trace('My Pipeline', 'Description of what this does');

// Add steps with the fluent API
trace
  .step('Data Processing', 'transform')
  .input({ rawData: [...] }, 'Raw input data')
  .output({ processed: [...] }, 'Cleaned and transformed data')
  .reasoning('Removed null values and normalized strings')
  .end();

// Complete the trace
const finalTrace = await trace.end({
  success: true,
  summary: 'Pipeline completed successfully',
  data: { result: 'final output' }
});
```

### Step Types

X-Ray supports different step types for visual distinction:

- `llm` — LLM/AI model calls (purple)
- `search` — Search/query operations (cyan)
- `filter` — Filtering/validation steps (amber)
- `rank` — Ranking/scoring operations (emerald)
- `transform` — Data transformations (rose)
- `custom` — Generic steps (gray)

### Capturing Filter Results

```typescript
trace
  .step("Apply Filters", "filter")
  .input({ candidates: 50 })
  .filters([
    {
      name: "price_range",
      rule: "0.5x - 2x reference",
      value: { min: 15, max: 60 },
    },
    { name: "min_rating", rule: "At least 3.8 stars", value: 3.8 },
  ])
  .candidates([
    {
      id: "product-1",
      label: "HydroFlask 32oz",
      metrics: { price: 44.99, rating: 4.5 },
      evaluations: [
        {
          id: "price",
          label: "Price Range",
          passed: true,
          detail: "$44.99 within range",
        },
        { id: "rating", label: "Rating", passed: true, detail: "4.5 >= 3.8" },
      ],
      qualified: true,
    },
    // ... more candidates
  ])
  .output({ passed: 12, failed: 38 })
  .reasoning("Applied price and rating filters, 12 candidates qualified")
  .end();
```

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── traces/        # Trace CRUD operations
│   │   └── demo/          # Demo pipeline endpoint
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Landing page
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── TraceList.tsx  # Sidebar trace list
│   │   └── TraceDetail.tsx # Full trace visualization
│   └── ui/                # Shadcn/UI components
└── lib/
    ├── xray/              # X-Ray library
    │   ├── types.ts       # Type definitions
    │   ├── xray.ts        # Main XRay class
    │   └── store.ts       # File-based storage
    └── demo/              # Demo application
        ├── products.ts    # Mock product database
        └── pipeline.ts    # Competitor selection pipeline
```

### Data Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Your Code      │────▶│   XRay Library   │────▶│   Storage        │
│   (Pipeline)     │     │   (Fluent API)   │     │   (.xray/traces) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           │
                                                           ▼
                         ┌──────────────────┐     ┌──────────────────┐
                         │   Dashboard UI   │◀────│   API Routes     │
                         │   (React)        │     │   (Next.js)      │
                         └──────────────────┘     └──────────────────┘
```

### Key Design Decisions

1. **Fluent Builder API** — Intuitive method chaining for building traces
2. **File-based Storage** — Simple JSON files for ease of debugging and portability
3. **Step Type System** — Visual categorization of different operation types
4. **Candidate Evaluation Model** — First-class support for tracking items through filters

## 🎨 UI Components

### TraceList

Displays all traces with status indicators, timestamps, and step counts.

### TraceDetail

Full trace visualization including:

- Pipeline flow diagram
- Expandable step cards
- Input/output data viewers
- Filter and candidate evaluation details
- Reasoning banners

### Design Features

- Dark theme with glassmorphism effects
- Custom color palette (cyan, purple, amber, emerald, rose)
- Smooth animations with Framer Motion
- Responsive layout for various screen sizes

## 🔧 API Reference

### REST Endpoints

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | `/api/traces`      | List all traces    |
| POST   | `/api/traces`      | Create a new trace |
| GET    | `/api/traces/[id]` | Get single trace   |
| PATCH  | `/api/traces/[id]` | Update trace       |
| DELETE | `/api/traces/[id]` | Delete trace       |
| POST   | `/api/demo/run`    | Run demo pipeline  |

### Type Definitions

```typescript
interface XRayTrace {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: "running" | "completed" | "failed";
  steps: XRayStep[];
  result?: {
    success: boolean;
    summary: string;
    data?: Record<string, unknown>;
  };
}

interface XRayStep {
  id: string;
  name: string;
  type: "transform" | "filter" | "llm" | "search" | "rank" | "custom";
  timestamp: string;
  duration: number;
  input: { description?: string; data: Record<string, unknown> };
  output: { description?: string; data: Record<string, unknown> };
  reasoning: string;
  filters?: XRayFilter[];
  candidates?: XRayCandidate[];
}
```

## ⚠️ Known Limitations

1. **File-based Storage** — Not suitable for production multi-process deployments
2. **No Authentication** — Dashboard is publicly accessible
3. **No Real-time Updates** — Requires page refresh to see new traces
4. **Single-process Execution** — Library is designed for single-process use

## 🛣️ Future Improvements

- [ ] Database backend (PostgreSQL, MongoDB, or SQLite)
- [ ] WebSocket for real-time trace updates
- [ ] Advanced search and filtering
- [ ] Trace comparison view (side-by-side)
- [ ] Export as PDF/HTML reports
- [ ] Integration packages for popular frameworks (LangChain, LlamaIndex)
- [ ] Distributed tracing support
- [ ] Authentication and multi-tenant support
- [ ] Trace retention policies and cleanup

## 🧪 Demo Application

The included demo implements a **Competitor Product Selection** pipeline:

1. **Keyword Generation** (LLM step) — Extracts search terms from product title
2. **Candidate Search** (Search step) — Searches mock database of 50+ products
3. **Apply Filters** (Filter step) — Price range, rating, review count filters
4. **LLM Relevance Check** (LLM step) — Identifies false positives (accessories, etc.)
5. **Rank & Select** (Rank step) — Scores candidates and selects best match

This demonstrates the full power of X-Ray for understanding complex decision pipelines.
