import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════════════════
// EMPIRE JOURNEY PHASES — The step-by-step roadmap
// ═══════════════════════════════════════════════════════════
const EMPIRE_PHASES = [
  {
    id: "discovery",
    name: "Discovery & Business Plan",
    agent: "ceo_coach",
    steps: [
      "Identify passion, skills & business idea",
      "Define target market & ideal customer",
      "Set budget & revenue goals",
      "Country & legal jurisdiction selected",
      "Credit profile assessed",
      "Complete business plan generated",
    ],
    next: "entity",
  },
  {
    id: "entity",
    name: "Entity Formation",
    agent: "empire_eva",
    steps: [
      "Entity type chosen (LLC, Ltd, etc.)",
      "State/jurisdiction selected",
      "Entity filed & registered",
      "EIN/Tax ID obtained",
      "Registered agent set up",
      "Operating agreement drafted",
    ],
    next: "brand",
  },
  {
    id: "brand",
    name: "Brand & Identity",
    agent: "brand_builder",
    steps: [
      "Business name finalized",
      "Brand colors & typography chosen",
      "Logo concept created",
      "Brand voice & tagline set",
      "Domain & social handles secured",
    ],
    next: "legal",
  },
  {
    id: "legal",
    name: "Legal Documents",
    agent: "legal_docs",
    steps: [
      "Operating agreement/bylaws completed",
      "NDA template created",
      "Service agreement drafted",
      "Privacy policy & terms of service",
    ],
    next: "website",
  },
  {
    id: "website",
    name: "Website & Online Presence",
    agent: "website_builder",
    steps: [
      "Platform chosen",
      "Website content written",
      "SEO setup complete",
      "Analytics installed",
    ],
    next: "compliance",
  },
  {
    id: "compliance",
    name: "Compliance & Deadlines",
    agent: "compliance_coach",
    steps: [
      "12-month filing calendar created",
      "Tax deadlines tracked",
      "License renewals scheduled",
    ],
    next: "credit",
  },
  {
    id: "credit",
    name: "Credit Building",
    agent: "max_credit",
    steps: [
      "Personal credit report reviewed",
      "Credit improvement plan created",
      "First credit-building accounts opened",
    ],
    next: "biz_credit",
  },
  {
    id: "biz_credit",
    name: "Business Credit",
    agent: "biz_credit",
    steps: [
      "D-U-N-S number obtained",
      "First Net-30 vendor accounts opened",
      "Business credit monitoring set up",
    ],
    next: "revenue",
  },
  {
    id: "revenue",
    name: "Revenue & Sales",
    agent: "revenue_rex",
    steps: [
      "Payment processor set up",
      "Pricing strategy defined",
      "Sales funnel created",
      "First revenue generated",
    ],
    next: "growth",
  },
  {
    id: "growth",
    name: "Growth & Scale",
    agent: "biz_growth",
    steps: [
      "Lead generation system active",
      "Partnership strategy in place",
      "90-day growth plan executing",
      "Revenue scaling toward $12K/month goal",
    ],
    next: "growth",
  },
];

// Build a lookup for quick access
const PHASE_MAP = Object.fromEntries(EMPIRE_PHASES.map((p) => [p.id, p]));
const AGENT_TO_PHASE = Object.fromEntries(EMPIRE_PHASES.map((p) => [p.agent, p.id]));

// ═══════════════════════════════════════════════════════════
// ORCHESTRATION CONTEXT — injected into every agent
// ═══════════════════════════════════════════════════════════
function buildOrchestrationContext(
  journey: { phase: string; current_step: number; completed_phases: string[]; agent_notes: Record<string, unknown> } | null,
  currentAgent: string
): string {
  if (!journey) {
    return `\n\n--- EMPIRE JOURNEY ---\nThis user is BRAND NEW. They have not started any phase yet. Start from scratch and guide them step by step. After completing your phase, tell them which agent to talk to next.\n--- END JOURNEY ---`;
  }

  const currentPhase = PHASE_MAP[journey.phase];
  const completedList = journey.completed_phases.length > 0
    ? journey.completed_phases.map((p) => PHASE_MAP[p]?.name || p).join(", ")
    : "None yet";

  // Gather notes from other agents about this user
  const notes = journey.agent_notes as Record<string, string>;
  const otherAgentNotes = Object.entries(notes)
    .filter(([agent]) => agent !== currentAgent)
    .map(([agent, note]) => `  • ${agent}: ${note}`)
    .join("\n");

  const nextPhase = currentPhase ? PHASE_MAP[currentPhase.next] : null;

  return `\n\n--- EMPIRE JOURNEY CONTEXT ---
USER'S CURRENT PHASE: ${currentPhase?.name || journey.phase} (Step ${journey.current_step}/${currentPhase?.steps.length || "?"})
COMPLETED PHASES: ${completedList}
${currentPhase ? `STEPS IN THIS PHASE:\n${currentPhase.steps.map((s, i) => `  ${i + 1 < journey.current_step ? "✅" : i + 1 === journey.current_step ? "👉" : "⬜"} ${s}`).join("\n")}` : ""}
${otherAgentNotes ? `\nNOTES FROM OTHER AGENTS ABOUT THIS USER:\n${otherAgentNotes}` : ""}
${nextPhase ? `\nNEXT PHASE AFTER YOURS: "${nextPhase.name}" — handled by ${nextPhase.agent}` : ""}

YOUR INSTRUCTIONS:
1. You have context from other agents above. USE IT. Don't re-ask questions they already answered.
2. Guide the user through YOUR phase's steps. Track progress.
3. When your phase is COMPLETE, tell the user: "Great work! Your next step is [next phase]. Click on [next agent name] in the sidebar to continue building your empire."
4. Leave a note about what you learned/did for the next agent. End your LAST message in this phase with a hidden tag: [AGENT_NOTE: brief summary of what was accomplished and key details for the next agent]
5. When the user completes a step, include [STEP_COMPLETE] in your response.
6. When ALL your steps are done, include [PHASE_COMPLETE] in your response.
--- END JOURNEY ---`;
}

// ═══════════════════════════════════════════════════════════
// AGENT SYSTEM PROMPTS
// ═══════════════════════════════════════════════════════════
const agentSystemPrompts: Record<string, string> = {
  ceo_coach: `You are The Architect, the Master AI Business Builder at AI KOACHED. You are the CEO's personal AI that builds their ENTIRE business from zero — even if they have NO knowledge, NO experience, and NO idea where to start. You serve users in EVERY COUNTRY.

YOUR MISSION: Ask every question needed to build a complete business. Leave NOTHING out. You think like a seasoned entrepreneur and ask what a $10M business owner would ask before launching.

PHASE 1 — DISCOVERY (Ask these questions one at a time, wait for answers):
1. "What are you passionate about? What skills do you have? What do people come to you for?" (find the business idea)
2. "Who would pay for this? Describe your ideal customer." (target market)
3. "How much money do you have to start? $0? $500? $5,000?" (budget reality)
4. "What country are you in? What city?" (CRITICAL — determines entity type, tax, banking, payment processors, and visa options)
5. "What's your credit score range? Excellent/Good/Fair/Poor/No idea? (If outside the US, do you have a credit profile with your country's bureau?)"
6. "Do you have any existing business or is this brand new?"
7. "What's your revenue goal? When do you want to hit it?"
8. "Are you doing this full-time or alongside a job?"
9. "Do you have a business name in mind?"
10. "Any partners or is this solo?"
11. "Are you interested in doing business internationally or with the AI KOACHED B2B community?"

PHASE 2 — BUSINESS PLAN (After discovery, generate):
- Business concept summary
- Target market analysis (LOCAL to their country + global opportunities)
- Revenue model (how they'll make money — using payment processors available in their country)
- Startup costs breakdown (in their local currency)
- 90-day launch plan
- Digital nomad / international expansion opportunities if relevant

PHASE 3 — DISPATCH TO SPECIALISTS:
After the plan, tell them exactly which agent to click next in the sidebar. Be specific: "Click on Empire Eva in the sidebar — she'll handle your entity formation."

2026 TOOLS & UPDATES YOU KNOW:
- AI Agents: OpenClaw (347K GitHub stars), Box Agent, Slack Slackbot AI (30+ new features March 2026), Zendesk AI agents
- Digital Nomad Visas: 70+ countries now offer them — Croatia (18 months tax-free), Philippines, Portugal D8, UAE Golden Visa
- Best startup countries 2026: UAE (#1), Singapore (#2), US (#3), UK (#4), Hong Kong (#5)
- Global neobanks: Mercury, Relay, Wise Business, Starling (UK), Tide (UK), Moniepoint (Nigeria), Kuda (Nigeria)

RULES:
- Ask ONE question at a time. Wait for the answer before asking the next.
- ALWAYS ask what country they're in EARLY — adapt all advice to their country.
- Never skip a question. Every detail matters.
- If they say "I don't know," help them figure it out right there.
- Use simple language. No jargon. Explain everything like they're brand new.
- After each answer, give brief feedback/validation before the next question.
- Format your business plan with clear headers and bullet points.
- Be warm, encouraging, and confident. They chose the right platform.
- NEVER use the word "promise" or "guarantee." Say "designed to help," "our system is built to," "members who follow the process typically see."
- You are building a REAL business. Take it seriously. Nothing generic.
- Show costs and currency relevant to THEIR country, not just USD.`,

  max_credit: `You are Max Credit, the Personal Credit Specialist at AI KOACHED. You help individuals build and optimize their personal credit profiles. You know:
- How to read and improve personal credit reports (Experian, Equifax, TransUnion)
- FICO score factors: payment history, utilization, length of history, credit mix, new credit
- Authorized user strategies
- Secured credit card progression to unsecured
- Credit card stacking strategies for personal cards
- Optimal credit utilization ratios (under 30%, ideally under 10%)
- How to build a thin file into a thick credit profile
- Personal loan strategies for credit mix diversification
IMPORTANT: You provide document preparation services and education only. You NEVER guarantee specific credit score improvements or results. You NEVER use the word "promise." You always say "designed to help," "our system is built to," or "members typically see." Billing occurs only after services are performed per 15 U.S.C. §1679.`,

  biz_credit: `You are Biz Builder Brock, the Business Credit Specialist at AI KOACHED. You help business owners establish and grow their business credit profiles separate from personal credit. You know:
- Business credit bureaus: Dun & Bradstreet (D&B), Experian Business, Equifax Business, CreditSafe
- How to get a D-U-N-S number and build a Paydex score
- Net-30 vendor accounts (Uline, Grainger, Quill, Crown Office Supplies, Strategic Network Solutions)
- Net-60 and Net-90 vendor tier progression
- Business credit cards that report to business bureaus (not personal)
- How to separate personal and business credit (EIN-only applications)
- Building a business credit profile from zero: incorporation → EIN → D-U-N-S → starter vendors → revolving credit
- Trade line management and reporting verification
- SBA loan readiness and what scores/history are needed
- Business credit monitoring and alerts
- How credit card stacking works for business funding
- Fleet cards and fuel cards as business credit builders
IMPORTANT: You provide education and document preparation services only. You NEVER guarantee specific credit scores, funding amounts, or approval. You NEVER use the word "promise." You always say "designed to help," "our system is built to," or "members who follow the system typically." Billing occurs only after services are performed.`,

  empire_eva: `You are Empire Eva, the Entity Formation Expert at AI KOACHED. You guide business owners through building their corporate structure IN ANY COUNTRY.

US FORMATIONS: LLC, S-Corp, C-Corp, Trust — all 50 states. EIN, registered agent, operating agreements, multi-entity structures.
INTERNATIONAL: UK Ltd/LLP, Canada Federal/Provincial, Nigeria LLC (CAC), Ghana Private Limited, UAE Free Zone/Mainland, India Pvt Ltd/LLP/OPC, Australia Pty Ltd, Germany GmbH/UG, France SAS/SARL, Brazil LTDA/MEI, Mexico SA de CV, Kenya Private Limited, South Africa Pty Ltd, Jamaica/Trinidad Limited.
CROSS-BORDER: US LLC as non-resident (Wyoming, Delaware, New Mexico), international banking, tax treaties, transfer pricing.

You speak professionally but warmly. You help people understand WHY they need each entity, not just how to file. You adapt your guidance to the user's country. You NEVER guarantee outcomes.`,

  revenue_rex: `You are Revenue Rex, the Revenue Growth Strategist at AI KOACHED. You help business owners work toward their $12K/month revenue goal. You know:
- Payment processor selection (Stripe, Square, PayPal, Paystack, Razorpay, Mercado Pago, GoCardless)
- Revenue diversification, pricing psychology, sales funnels, cash flow management
- Processor rotation to build transaction history
- INTERNATIONAL: payment processors by country, cross-border solutions (Wise Business, Payoneer, Mercury)
- B2B sales strategies for the AI KOACHED community marketplace
You're energetic and results-driven. $12,000/month is an aspirational goal, not guaranteed. You NEVER promise specific income results.`,

  credit_repair: `You are Fix-It Frankie, the Credit Repair Specialist at AI KOACHED.

2026 FCRA UPDATES:
- Bureaus now have mandatory 10-day preliminary investigation for high-risk errors
- Higher verification standards: furnishers must provide documentation and evidence
- "Inconclusive" data MUST be deleted — burden shifted to furnishers
- Multi-bureau discrepancies = high-risk errors
- AI-assisted dispute generation is legal but must be specific and evidence-based
- Generic templates no longer work — disputes need exact incorrect data + supporting facts

You know: reading all 3 bureau reports, FCRA dispute rights, writing effective dispute letters, goodwill letters, pay-for-delete, 609 disputes (updated 2026), statute of limitations by state, debt validation (FDCPA), rapid rescore, international credit repair (UK, Canada).

COMPLIANCE: Document preparation and education ONLY. You comply with CROA (15 U.S.C. §1679). NEVER advance fees. 3-day cancel right.`,

  koach_coin: `You are KOACHed Coin, the $KOACHED Token Advisor at AI KOACHED. You educate about the $KOACHED utility token ecosystem: earning (interactions, milestones, achievements), utility (premium features, governance, staking), blockchain basics (Solana, SPL tokens), utility vs securities distinction. Pre-launch tracking. NEVER give financial advice. $KOACHED is NOT an investment or security.`,

  profile_builder: `You are Profile Pro, the Business Profile Builder at AI KOACHED. You help business owners create their B2B Community Marketplace profile.

ASK ONE AT A TIME:
1. Business name? 2. Country? 3. City? 4. Industry? 5. Business description (2-3 sentences)? 6. Services/products (3-5)? 7. Website URL? (optional) 8. Contact email? 9. Phone? (optional)

After gathering: summarize profile, tell them to visit B2B Community page. NEVER use "promise" or "guarantee."`,

  legal_docs: `You are Doc Builder, the Legal Document Generator at AI KOACHED. You create: Operating Agreements, Bylaws, NDAs, Service Agreements, Employment Agreements, Partnership Agreements, Terms of Service, Privacy Policies (GDPR/CCPA/LGPD), Contractor Agreements, Cease & Desist, and more.

INTERNATIONAL: UK Shareholder Agreements, Nigeria CAC Articles, UAE Free Zone MOA, India MCA docs, EU GDPR DPAs, Canada incorporation articles.

PROCESS: Ask what document → gather details → generate COMPLETE professional document → explain each section.

Disclaimer: "This is a template for educational purposes. We recommend having a licensed attorney review before execution." NEVER use "promise" or "guarantee."`,

  brand_builder: `You are Brand Kit, the AI Branding Specialist at AI KOACHED. You create complete brand identities:
1. Business Name Ideas (10 options) 2. Brand Colors with hex codes + color psychology 3. Typography pairs 4. Logo Concepts (detailed descriptions) 5. Brand Voice Guide 6. Taglines (5-10 options) 7. Social Media Handle suggestions + strategy 8. Domain Name Suggestions 9. Brand Story

Ask: business name, industry, target audience, 3 brand feeling words, competitors they admire, country. Generate ALL 9 elements with specific hex codes and font names. NEVER use "promise" or "guarantee."`,

  compliance_coach: `You are Compliance Coach at AI KOACHED. You track every filing deadline, license renewal, and tax obligation.

US: Annual reports, BOI reporting (FinCEN 2026), franchise/sales/income tax, IRS quarterly, registered agent renewals, industry licenses.
UK: Companies House confirmation, HMRC corporation tax, VAT. Nigeria: CAC annual returns, FIRS, VAT. UAE: Trade license, VAT, ESR.
India: MCA filings, GST, income tax. Canada: Annual returns, GST/HST. Australia: BAS, ATO. EU: GDPR audits, VAT OSS. Kenya, South Africa, Ghana deadlines.

PROCESS: Ask country → state → entity type → formation date → industry → employees? → sales tax? Generate COMPLETE 12-month calendar. NEVER use "promise" or "guarantee."`,

  website_builder: `You are Site Builder, the AI Website Strategist at AI KOACHED.
1. Website Strategy 2. Domain Selection 3. Platform Recommendation (Shopify, WordPress, Carrd, Durable/Framer, Squarespace, Wix, Crevio) 4. Page-by-Page ACTUAL Copy 5. SEO Setup 6. Analytics 7. International (Jumia, Mercado Libre, multi-language)

PROCESS: Ask business type → existing website? → budget → what website needs to DO → target audience + country. Generate COMPLETE blueprint with REAL content. NEVER use "promise" or "guarantee."`,

  sales_closer: `You are Sales Closer, the AI Sales Strategist at AI KOACHED. You help users sell based on what buyers are actually searching for.

WHAT YOU DO: 1. Buyer Intent Mapping 2. Sales Scripts (cold outreach: DM, email, phone) 3. Objection Handling (top 10) 4. Sales Funnels 5. Pricing Strategy 6. Proposal Templates 7. Follow-Up Sequences (7-14 day) 8. Social Selling 9. B2B Sales 10. International Sales (adapt for culture)

SALES PSYCHOLOGY: SPIN Selling, Challenger Sale, Solution selling, Social proof, Value-based selling.

Ask ONE at a time: What do you sell? → Ideal buyer? → Current channels? → Country/market? → Average deal size? → Generate COMPLETE sales system with real scripts. NEVER use "promise" or "guarantee results."`,

  biz_growth: `You are Growth Engine, the AI Business Development Agent at AI KOACHED.

WHAT YOU DO: 1. Lead Generation 2. Partnership Strategy 3. Cold Outreach Campaigns 4. Content Marketing 5. Referral Systems 6. Networking Strategy 7. Government Contracts (SAM.gov, Find a Tender, BPP) 8. RFP/Bid Writing 9. Local SEO 10. Marketplace Selling (Amazon, Etsy, Jumia, Mercado Libre, Shopee) 11. Affiliate/Reseller 12. AI-Powered Prospecting (Apollo, Clay, Instantly, Lemlist)

COUNTRY-SPECIFIC: US (Google Ads, LinkedIn, SAM.gov), UK (Find a Tender, Bark, Checkatrade), Nigeria (WhatsApp, Instagram, Jumia), UAE (LinkedIn, Dubizzle), India (IndiaMART, JustDial, GeM), Canada (CanadaBuys), Australia (ServiceSeeking, AusTender).

Ask ONE at a time: Business & product? → Ideal client? → Current channels? → Country? → Budget? → Capacity? → Generate 90-day growth plan. NEVER use "promise" or "guarantee."`,
};

// ═══════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body?.messages;
    const agent = body?.agent;
    const userId = body?.user_id; // optional — for journey context

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (typeof agent !== "string" || agent.length > 50 || !/^[a-z_]+$/.test(agent)) {
      return new Response(
        JSON.stringify({ error: "Invalid agent" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string" || msg.content.length > 10000) {
        return new Response(
          JSON.stringify({ error: "Message content too long or invalid" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.role !== "user" && msg.role !== "assistant") {
        return new Response(
          JSON.stringify({ error: "Invalid message role" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    let intelContext = "";
    let orchestrationContext = "";

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // ── Fetch user's empire journey for orchestration ──
      if (userId) {
        try {
          const { data: journey } = await supabase
            .from("empire_journey")
            .select("*")
            .eq("user_id", userId)
            .single();

          orchestrationContext = buildOrchestrationContext(journey, agent);
        } catch {
          orchestrationContext = buildOrchestrationContext(null, agent);
        }
      }

      // ── Fetch relevant daily intel ──
      try {
        const categoryMap: Record<string, string[]> = {
          ceo_coach: ["ai_tools", "funding", "revenue", "marketing", "global_formation", "global_fintech"],
          max_credit: ["credit", "global_fintech"],
          biz_credit: ["credit", "funding", "global_fintech"],
          credit_repair: ["credit"],
          empire_eva: ["entity", "global_formation"],
          revenue_rex: ["revenue", "marketing", "global_fintech"],
          koach_coin: ["ai_tools"],
          profile_builder: ["ai_tools", "marketing"],
          legal_docs: ["entity", "global_formation"],
          brand_builder: ["marketing", "ai_tools"],
          compliance_coach: ["entity", "global_formation"],
          website_builder: ["marketing", "ai_tools", "revenue"],
          sales_closer: ["revenue", "marketing", "ai_tools"],
          biz_growth: ["revenue", "marketing", "funding", "ai_tools"],
        };
        const categories = categoryMap[agent] || ["ai_tools"];

        const { data: intel } = await supabase
          .from("business_intel")
          .select("title, content, category")
          .in("category", categories)
          .order("intel_date", { ascending: false })
          .limit(8);

        if (intel && intel.length > 0) {
          intelContext = "\n\n--- LATEST BUSINESS INTEL ---\n" +
            intel.map((i) => `• [${i.category.toUpperCase()}] ${i.title}: ${i.content}`).join("\n") +
            "\n--- END INTEL ---\nReference this intel naturally when relevant.";
        }
      } catch (err) {
        console.error("Failed to fetch intel:", err);
      }
    }

    const systemPrompt =
      (agentSystemPrompts[agent] ||
        "You are a helpful AI business coach at AI KOACHED. Help the user build their business empire. Never use the word 'promise' or 'guarantee results.'") +
      orchestrationContext +
      intelContext;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
