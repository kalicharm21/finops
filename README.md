# FinOps AI — AgentPay OS

> **Autonomous Financial Operations & Revenue Optimization Operating System**  
> Powered by **Groq LPU™ Inference Engine** (`llama-3.3-70b-versatile`) with deterministic policy guardrails, human-in-the-loop governance, and Razorpay Test Mode integration.

---

## 1. Executive Summary

**FinOps AI (AgentPay OS)** is an enterprise-grade autonomous financial operations platform designed for modern merchants and multi-channel retailers. The platform continuously observes real-time transaction streams, discovers revenue opportunities (e.g., basket attach drops, mid-day conversion lulls, cart abandonment), models high-ROI promotional campaigns, and executes them within strict deterministic policy guardrails.

Powered by Groq's high-throughput Tensor Streaming Processor LPU engine, FinOps AI achieves sub-150ms reasoning cycles to synthesize operational decisions without risking unconstrained financial loss.

---

## 2. Core Architectural Pillars

```
+-----------------------------------------------------------------------------+
|                               FinOps AI OS                                  |
+-----------------------------------------------------------------------------+
               |                                              |
      [Transaction Stream]                           [Operator Mission]
               v                                              v
+-----------------------------+               +-------------------------------+
|  Real-Time Ingestion Engine |               | Strategic Mission Controller  |
+-----------------------------+               +-------------------------------+
               \                                             /
                \                                           /
                 v                                         v
       +-------------------------------------------------------------+
       |               Groq LPU™ Autonomous Agent Core                |
       |              (Model: llama-3.3-70b-versatile)               |
       |  - Real-time Opportunity Observation & Basket Modeling     |
       |  - Expected ROI & Financial Cost/Benefit Formulations        |
       |  - Natural Language FinOps Co-Pilot Strategy Interrogation  |
       +-------------------------------------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |             Deterministic Policy Guardrail Engine           |
       |  - 14+ Hard Safety Boundaries (Limits, Vendor Whitelists)   |
       |  - Dynamic Hurdle Rate & Maximum Single Spend Enforcement   |
       |  - Mathematical Policy Scoring (ALLOW / HOLD / REJECT)      |
       +-------------------------------------------------------------+
                         /                         \
           [Within Autonomy Threshold]      [Exceeds Policy Limits]
                       /                             \
                      v                               v
       +-------------------------------+   +----------------------------------+
       |   Autonomous Execution Engine |   |  Human-in-the-Loop Approval Queue |
       | - Razorpay Payment Links API  |   | - Operator Override & Budget Mod |
       | - Dynamic SMS/WhatsApp Blasts |   | - Granular Violation Explanations|
       +-------------------------------+   +----------------------------------+
                      \                               /
                       v                             v
       +-------------------------------------------------------------+
       |          Immutable Financial Ledger & Audit Trail           |
       |   - Cryptographic Evidence Hashes & Telemetry Logs          |
       |   - Real-time P&L, Fee Breakdown & Trajectory Projection    |
       +-------------------------------------------------------------+
```

---

## 3. Key Feature Modules

### 3.1 Mission Control & Autonomous Agent Dashboard
- **Autonomous Decision Cycles**: Agent synthesizes real-time basket data and formulates structured financial opportunities with calculated expected revenue, spend, and ROI.
- **Adjustable Autonomy Levels**:
  - `Manual (0%)`: Every proposal requires operator sign-off.
  - `Assisted (50%)`: Low-risk proposals under conservative limits execute automatically; higher amounts queue for approval.
  - `Semi-Autonomous (75%)`: Executes approved channels and standard vendor allocations within daily caps.
  - `Autonomous (85%+)`: Full self-driving execution for all proposals meeting deterministic policy criteria.
- **Hardware Kill-Switch**: Instantly freezes all autonomous spending and halts pending agent disbursements.
- **Groq FinOps Co-Pilot**: Interactive conversational assistant running directly on Groq LPU (`llama-3.3-70b-versatile`) to query cash flow trajectory, examine policy holds, or run margin calculations.

### 3.2 Deterministic Policy Guardrails
Hardcoded rules that cannot be hallucinated or bypassed by LLM reasoning:
1. **Maximum Single Transaction Limit**: Defaults to ₹1,500. Spends above this limit automatically route to the approval queue.
2. **Daily Spend Velocity Cap**: Restricts cumulative automated marketing disbursements per 24 hours.
3. **Minimum ROI Hurdle Rate**: Strict requirement that expected ROI exceeds benchmark (e.g., 2.0x).
4. **Authorized Vendor Whitelist**: Restricts automated payments to approved marketing and messaging partners (Meta, Google Ads, Razorpay, Twilio).
5. **Cooldown Intervals**: Prevents rapid repeated re-execution of identical campaign types.
6. **Stop-Loss Auto Kill**: Suspends active campaigns underperforming historical conversion floors.

### 3.3 Human-in-the-Loop Approvals
- Clear breakdown of tripped guardrails and policy triggers.
- Multi-action controls: **Approve**, **Reject with Comment**, or **Modify Budget** before authorizing.
- Complete audit trace linking human decisions back to the originating agent observation.

### 3.4 Razorpay Test Mode Integration
- Integrated mock and live payment link generator.
- Generates customer checkout URLs with custom amounts, descriptions, and expiration timestamps.
- Simulates real-world payment flows, gateway fees, and instant receipt confirmations.
- Fully configurable in the Settings panel with API Key and Secret toggles.

### 3.5 Real-Time Ledger & Transaction Simulator
- Double-entry styled operational ledger recording inflows, promotional expenditures, and gateway service charges.
- Interactive transaction simulator with adjustable traffic rates, order velocity, and burst scenario testing.

### 3.6 Campaign Management
- Generates targeted customer incentives (e.g., lunch combos, abandoned checkout recovery, afternoon happy hours).
- AI-generated copy and CTA links customized per channel (WhatsApp, SMS, Email).

---

## 4. Groq LPU™ Engine Architecture

FinOps AI utilizes Groq's low-latency inference infrastructure via the official `groq-sdk`:

- **Primary Model**: `llama-3.3-70b-versatile`
- **Inference Hardware**: Groq LPU™ (Language Processing Unit) Tensor Streaming Processor
- **Latency Profile**: ~90ms to 140ms per decision cycle
- **Response Format**: Strict JSON object mode (`response_format: { type: "json_object" }`)

### Server-Side Proxy Endpoints (`server.ts`)
To protect API credentials, all Groq calls are proxied through the Express backend:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/groq/agent-cycle` | `POST` | Formulates structured opportunity proposals with observation, hypothesis, budget, and ROI |
| `/api/groq/copilot-chat` | `POST` | Powers the conversational FinOps assistant for operator inquiries |
| `/api/groq/generate-campaign` | `POST` | Generates high-converting marketing copy and payment link descriptions |
| `/api/groq/status` | `GET` | Health check reporting LPU connectivity and model status |
| `/api/health` | `GET` | General application health and runtime information |

---

## 5. Technology Stack

- **Frontend**:
  - React 19 / TypeScript 5.8
  - Vite 6 (Single Page Application architecture)
  - Tailwind CSS v4 with custom styling utilities
  - Lucide React (featherweight SVG icons)
  - Recharts 3.x (real-time financial time series and trajectory curves)
  - Motion (micro-interactions and animated state transitions)
- **Backend**:
  - Node.js with Express 4.21
  - Groq SDK (`groq-sdk`)
  - `dotenv` for environment management
  - `tsx` for high-speed TypeScript development runtime
  - `esbuild` for single-bundle CommonJS server production builds (`dist/server.cjs`)

---

## 6. Directory Structure

```
├── .env.example               # Template environment configuration
├── index.html                 # HTML entry point with metadata tags
├── metadata.json              # Platform capabilities and app manifest
├── package.json               # Dependencies and build scripts
├── server.ts                  # Express backend proxy with Groq SDK integration
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite build & plugin setup
└── src/
    ├── App.tsx                # Main view router & tab coordinator
    ├── index.css              # Global styles and Tailwind configuration
    ├── main.tsx               # React application mounting point
    ├── types/
    │   └── index.ts           # Global data types, models, and interfaces
    ├── context/
    │   └── AppContext.tsx     # Centralized state management & event bus
    ├── lib/
    │   ├── ai/
    │   │   └── agentService.ts# Agent decision synthesis & Groq client bridge
    │   ├── policies/
    │   │   └── policyEngine.ts# Deterministic guardrails evaluation engine
    │   ├── storage/
    │   │   └── storageRepo.ts # Persistent storage repository with local cache
    │   └── payments/
    │       └── razorpay.ts    # Razorpay Test Mode client simulator
    └── components/
        ├── agent/             # Mission Control, Co-Pilot, Opportunity cards
        ├── approvals/         # Human-in-the-loop pending approval queue
        ├── audit/             # Immutable audit log and evidence viewer
        ├── campaigns/         # Growth campaigns & payment links generator
        ├── layout/            # Navigation header, sidebar, status badges
        ├── ledger/            # Real-time financial transaction records
        ├── missions/          # Strategic revenue sprint management
        ├── policies/          # Guardrail rules editor & toggles
        ├── settings/          # Groq LPU diagnostics & Razorpay config
        └── simulation/        # Live transaction generation simulator
```

---

## 7. Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or bun package manager
- Optional: Groq API Key (get one from [console.groq.com](https://console.groq.com))

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd finops-agentpay-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Groq API Key:
   ```env
   GROQ_API_KEY="gsk_your_actual_groq_api_key_here"
   ```
   *(Note: If `GROQ_API_KEY` is not provided, the app operates gracefully in smart fallback mode with simulated LPU latencies).*

### Development

Run the full-stack dev server (Express + Vite middleware):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Compile both the frontend SPA and the backend CommonJS server bundle:
```bash
npm run build
```

Run the production server:
```bash
npm start
```

---

## 8. Financial Safety & Security Principles

1. **Server-Side API Key Secrecy**: The Groq API Key and Razorpay Secrets are loaded only on the server inside `server.ts`. They are never sent to or visible in client-side bundles.
2. **Deterministic Rules Over AI Output**: The LLM suggests actions; deterministic code approves or gates them. Even if an AI model outputs an instruction to disburse ₹50,000, the policy engine intercepts the action and forces human review.
3. **No Phantom Writes**: All balance adjustments, expenditures, and simulated link generations produce an immutable audit log record with timestamps and policy check results.
4. **Kill-Switch Precedence**: Engaging the hardware Kill-Switch immediately blocks all outgoing automated transactions regardless of agent confidence score.

---

## 9. License

MIT License. Designed for AI Studio and production Cloud Run deployments.
