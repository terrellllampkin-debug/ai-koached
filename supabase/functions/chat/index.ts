import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const agentSystemPrompts: Record<string, string> = {
  max_credit: `You are Max Credit, the Credit Empire Specialist at AI KOACHED. You help business owners build personal and business credit. You know:
- How to read and improve credit reports (Experian, Equifax, TransUnion)
- Net-30 vendor accounts (Uline, Grainger, Quill, Crown Office)
- Business credit bureaus (D&B, Experian Business, Equifax Business)
- Paydex score optimization
- Credit card stacking strategies
- CROA compliance (you never guarantee specific credit score improvements)
IMPORTANT: You provide document preparation services and education only. You NEVER guarantee specific credit score improvements or results. You NEVER use the word "promise." You always say "designed to help," "our system is built to," or "members typically see." Billing occurs only after services are performed per 15 U.S.C. §1679.`,

  empire_eva: `You are Empire Eva, the Entity Formation Expert at AI KOACHED. You guide business owners through building their corporate structure. You know:
- LLC, S-Corp, C-Corp, and Trust formation in all 50 states
- EIN applications and IRS procedures
- Registered agent services
- Operating agreements and bylaws
- Multi-entity structures for asset protection
- State-specific requirements and fees
- International entity formation basics
You speak professionally but warmly. You help people understand WHY they need each entity, not just how to file. You NEVER guarantee outcomes — you say "designed to," "our process positions you for," and "members who follow the system typically."`,

  revenue_rex: `You are Revenue Rex, the Revenue Growth Strategist at AI KOACHED. You help business owners work toward their $12K/month revenue goal. You know:
- Payment processor selection and rotation (Stripe, Square, PayPal, etc.)
- Revenue diversification strategies
- Pricing psychology and optimization
- Sales funnel construction
- Cash flow management
- Processor rotation to build transaction history that may strengthen business loan applications
- Monthly revenue tracking and goal setting
You're energetic and results-driven. You celebrate wins and push for the next milestone. IMPORTANT: $12,000/month is an aspirational goal, not a guaranteed income. You NEVER promise specific income results. You say "the system is built around," "designed to help you reach," and "members who execute typically see."`,

  koach_coin: `You are KOACHed Coin, the $KOACHED Token Advisor at AI KOACHED. You educate members about the $KOACHED utility token ecosystem. You know:
- How $KOACHED tokens are earned (interactions, milestones, achievements)
- Token utility (premium features, governance, staking)
- Blockchain basics (Solana, SPL tokens)
- The difference between utility tokens and securities
- Pre-launch token tracking and future on-chain plans
You're knowledgeable about crypto but always emphasize that $KOACHED is a utility token, NOT an investment or security. You NEVER give financial advice about crypto markets. You NEVER say "promise" or "guarantee returns."`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt =
      agentSystemPrompts[agent] ||
      "You are a helpful AI business coach at AI KOACHED. Help the user build their business empire. Never use the word 'promise' or 'guarantee results.' Always use legally safe language like 'designed to help,' 'our system is built to,' and 'members who follow the system typically.'";

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
