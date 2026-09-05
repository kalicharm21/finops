import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Groq client accessor
let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'MY_GROQ_API_KEY') {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// Health & Status
app.get('/api/health', (req, res) => {
  const groq = getGroqClient();
  res.json({
    status: 'ok',
    groqConfigured: !!groq,
    model: 'llama-3.3-70b-versatile',
    hardware: 'Groq LPU™ Inference Engine',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/groq/status', (req, res) => {
  const groq = getGroqClient();
  res.json({
    configured: !!groq,
    model: 'llama-3.3-70b-versatile',
    provider: 'Groq Cloud LPU',
    status: groq ? 'ONLINE' : 'FALLBACK_SIMULATION',
    message: groq 
      ? 'Connected to Groq LPU™ ultra-low latency inference engine'
      : 'Running in smart fallback mode. Set GROQ_API_KEY in Secrets or .env to activate live Groq LPU API calls.'
  });
});

// Autonomous Agent Decision Cycle via Groq
app.post('/api/groq/agent-cycle', async (req, res) => {
  const startTime = Date.now();
  const { mission, recentTransactions = [], activePolicies = [], merchant, customGoal } = req.body;

  const groq = getGroqClient();

  const systemPrompt = `You are FinOps AI, an ultra-fast autonomous financial operations and revenue optimization agent for "${merchant?.name || 'Shio Café'}".
Your responsibility is to analyze real-time retail transaction data, current mission objectives, and guardrail constraints to formulate high-ROI operational interventions.

Rules & Guidelines:
1. Every proposal must have a mathematically defensible expected ROI, expected revenue, and reasonable ad/campaign cost.
2. Return strictly valid, parseable JSON matching the schema below.
3. No Markdown code fences, no introductory or trailing commentary—ONLY the raw JSON object.
4. Types of action:
   - "CREATE_CAMPAIGN" (WhatsApp/SMS blast, dynamic discount links, bundle offers)
   - "GENERATE_PAYMENT_LINK" (custom high-value booking, corporate catering, pre-order deposit)
   - "REALLOCATE_BUDGET" (shift funds from underperforming to high-converting channels)
   - "STOP_UNDERPERFORMING_CAMPAIGN" (stop-loss enforcement)

JSON Schema:
{
  "intent": "string (succinct executive summary of intended outcome)",
  "observation": "string (specific observation from current metrics, AOV, or customer basket attach)",
  "hypothesis": "string (if we execute X with cost Y, we achieve Z within timeframe)",
  "proposedAction": {
    "type": "CREATE_CAMPAIGN" | "GENERATE_PAYMENT_LINK" | "REALLOCATE_BUDGET" | "STOP_UNDERPERFORMING_CAMPAIGN",
    "title": "string (human readable title)",
    "amount": number (INR amount requested, integer),
    "channel": "string (e.g. WhatsApp + Razorpay Dynamic Link, Instagram Ads, SMS)",
    "vendor": "string (optional)",
    "details": {
      "targetUsers": number,
      "promoItem": "string",
      "discountPct": number,
      "couponCode": "string"
    }
  },
  "expectedRevenue": number (INR integer),
  "expectedCost": number (INR integer),
  "expectedROI": number (float, e.g. 5.2),
  "confidence": number (float between 0.70 and 0.98),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "evidence": [
    "string (bullet 1)",
    "string (bullet 2)",
    "string (bullet 3)"
  ],
  "reasoningTrace": "string (brief explanation of Groq LPU mathematical model)"
}`;

  const userPrompt = `Current Financial Mission:
- Goal: ${mission?.name || 'Revenue Sprint'} (${mission?.goalType || 'REVENUE_TARGET'})
- Target Revenue: ₹${mission?.targetRevenue || 25000}
- Current Revenue: ₹${mission?.currentRevenue || 13420}
- Budget Remaining: ₹${(mission?.budget || 5000) - (mission?.spent || 2480)} (Total Budget: ₹${mission?.budget || 5000})
- Min ROI Hurdle: ${mission?.minimumROI || 2.0}x
- Max Single Txn Limit: ₹${mission?.maximumSingleTransaction || 1500}

Merchant Details:
- Name: ${merchant?.name || 'Shio Café'}
- Category: ${merchant?.category || 'Specialty Coffee & Gourmet Bakery'}
- Monthly Baseline: ₹${merchant?.monthlyBaselineRevenue || 380000}

Recent Transaction Sample (${recentTransactions.length} items):
${recentTransactions.slice(0, 5).map((t: any) => `- ₹${t.amount}: ${t.action} (${t.status})`).join('\n') || '- ₹399 Lunch combo (SUCCESS)\n- ₹180 Artisan Pour-over (SUCCESS)'}

Active Guardrail Policies (${activePolicies.length} active):
${activePolicies.slice(0, 5).map((p: any) => `- ${p.name}: limit ${p.formattedValue} (${p.severity})`).join('\n')}

${customGoal ? `Specific Operator Directive: "${customGoal}"` : 'Formulate the next optimal autonomous revenue action now.'}`;

  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1024,
        response_format: { type: 'json_object' }
      });

      const rawContent = completion.choices[0]?.message?.content || '{}';
      let parsed = JSON.parse(rawContent);

      const latency = Date.now() - startTime;
      return res.json({
        success: true,
        decision: parsed,
        groqMetadata: {
          model: 'llama-3.3-70b-versatile',
          latencyMs: latency,
          hardware: 'Groq LPU™ Tensor Streaming Processor',
          liveApi: true,
          tokens: completion.usage?.total_tokens || 0
        }
      });
    } catch (err: any) {
      console.error('Groq API execution error, switching to resilient fallback:', err.message);
      // Fall through to fallback simulation
    }
  }

  // Graceful fallback if no GROQ_API_KEY or if Groq API rate-limited
  const latency = Math.floor(Math.random() * 80) + 95; // Groq sub-150ms speed simulation
  const fallbackTemplates = [
    {
      intent: 'Deploy dynamic lunch combo incentive to convert mid-day basket drop-offs',
      observation: 'Lunch traffic at Shio Café is clustering with standalone beverage orders (AOV ₹180). Sandwich attachment is 16% lower than historical benchmark.',
      hypothesis: 'Targeted WhatsApp coupon for ₹399 Artisan Brew + Panini bundle will lift basket attach by 24% and yield ₹5,200 in incremental revenue.',
      proposedAction: {
        type: 'CREATE_CAMPAIGN',
        title: 'Mid-Day Lunch Bundle Push (₹399 Combo)',
        amount: 680,
        channel: 'WhatsApp + Razorpay Payment Links',
        vendor: 'Meta Business & Razorpay',
        details: {
          targetUsers: 1400,
          promoItem: 'Artisan Pour-over + Panini',
          discountPct: 15,
          couponCode: 'GROQ_LUNCH_399'
        }
      },
      expectedRevenue: 5200,
      expectedCost: 680,
      expectedROI: 7.65,
      confidence: 0.94,
      riskLevel: 'LOW',
      evidence: [
        'Groq LPU pattern analysis: Lunch basket variance 28%',
        'Beverage standalone attach rate 84%, food attach only 16%',
        'Net margin on ₹399 bundle exceeds 71%'
      ],
      reasoningTrace: 'Groq LPU synthesized customer transaction stream: Optimal margin-to-CAC ratio identified at ₹680 ad budget with ₹5,200 expected conversion.'
    },
    {
      intent: 'Recover abandoned cart transactions with automated Razorpay instant pay incentive',
      observation: '142 cart sessions dropped off at checkout step in the last 24h with average cart value of ₹620.',
      hypothesis: 'Sending an automated ₹50 incentive via instant Razorpay payment link recovers 18% of abandoned checkouts within 15 minutes.',
      proposedAction: {
        type: 'CREATE_CAMPAIGN',
        title: 'Instant Checkout Recovery Link Blast',
        amount: 450,
        channel: 'SMS + Razorpay Payment Links',
        vendor: 'Razorpay Gateway',
        details: {
          targetUsers: 142,
          promoItem: 'Cart Recovery Voucher',
          discountPct: 8,
          couponCode: 'RECOVER50'
        }
      },
      expectedRevenue: 3400,
      expectedCost: 450,
      expectedROI: 7.55,
      confidence: 0.89,
      riskLevel: 'LOW',
      evidence: [
        '142 drop-offs at step: payment_select',
        'Historical checkout link conversion rate 15.2%',
        'Net margin on recovered carts exceeds 68%'
      ],
      reasoningTrace: 'Groq LPU identified micro-friction at payment gateway selection; single-click payment link eliminates 3 form steps.'
    }
  ];

  const selectedFallback = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];

  res.json({
    success: true,
    decision: selectedFallback,
    groqMetadata: {
      model: 'llama-3.3-70b-versatile',
      latencyMs: latency,
      hardware: 'Groq LPU™ Engine',
      liveApi: false,
      note: 'Provide GROQ_API_KEY in environment for unconstrained live Groq calls'
    }
  });
});

// Natural Language Copilot Chat powered by Groq
app.post('/api/groq/copilot-chat', async (req, res) => {
  const { message, context } = req.body;
  const groq = getGroqClient();

  const systemPrompt = `You are FinOps Co-Pilot, powered by Groq's llama-3.3-70b-versatile LPU engine.
You are an expert in merchant cash flow optimization, payment gateway economics (Razorpay), deterministic policy guardrails, and autonomous AI agents.
Be concise, mathematically sharp, insightful, and practical. Format with clean bullet points.`;

  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${JSON.stringify(context || {})}\n\nOperator Question: ${message}` }
        ],
        temperature: 0.4,
        max_tokens: 600
      });

      return res.json({
        reply: response.choices[0]?.message?.content || 'Analysis complete.',
        model: 'llama-3.3-70b-versatile',
        provider: 'Groq Cloud'
      });
    } catch (err: any) {
      console.error('Groq Co-pilot error:', err.message);
    }
  }

  // Fallback Co-Pilot Response
  res.json({
    reply: `**Groq FinOps Intelligence Report:**\n\n• **Revenue Trajectory:** Current mission is tracking at 54% of its ₹25,000 target with ₹13,420 captured.\n• **Policy Status:** All 14 deterministic guardrails (including ₹1,500 single-transaction threshold and 2.0x ROI hurdle) are active and strictly enforced.\n• **Optimization Opportunity:** Shifting ₹450 from broad digital display into instant Razorpay cart recovery links offers projected 7.5x ROI with low operational risk.\n• **Recommendation:** Maintain autonomous clearance up to 85% autonomy level. Any spend > ₹1,500 will automatically route to Human-in-the-Loop review.`,
    model: 'llama-3.3-70b-versatile (Simulated LPU)',
    provider: 'Groq LPU™'
  });
});

// Campaign Content Generator powered by Groq
app.post('/api/groq/generate-campaign', async (req, res) => {
  const { title, targetAudience, budget, discountPct } = req.body;
  const groq = getGroqClient();

  if (groq) {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Generate high-converting marketing copy and Razorpay payment link description for a retail café campaign. Return JSON { "headline": "...", "bodyText": "...", "cta": "...", "linkDescription": "..." }'
          },
          {
            role: 'user',
            content: `Campaign Title: ${title}, Target: ${targetAudience}, Budget: ₹${budget}, Discount: ${discountPct}%`
          }
        ],
        response_format: { type: 'json_object' }
      });
      const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
      return res.json({ success: true, copy: parsed });
    } catch (err: any) {
      console.error('Groq Campaign error:', err);
    }
  }

  res.json({
    success: true,
    copy: {
      headline: `Craving Artisan Roasts? Take ${discountPct || 15}% Off Today at Shio Café`,
      bodyText: `Your favorite pour-over and gourmet panini combo is ready. Tap below to pay instantly via Razorpay UPI or card and pick up in 5 minutes!`,
      cta: 'Claim & Pay Now',
      linkDescription: `Shio Café Special Promo Link • ₹${budget ? Math.round(budget / 10) : 399} Express Order`
    }
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinOps AI Server running on port ${PORT} with Groq LPU integration`);
  });
}

startServer();
