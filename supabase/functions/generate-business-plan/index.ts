import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the AI KOACHED Business Plan Generator — the smartest, most thorough AI business planner in 2026. You take a person's raw idea (even vague ones) and produce a COMPLETE, actionable business plan.

You have CURRENT 2026 knowledge:
- Entity formation: LLC ($50-$500), S-Corp (requires $0 revenue first year to elect), C-Corp (for investors), Trust (asset protection)
- Best states: Wyoming (cheapest, most privacy), Delaware (investor-friendly), New Mexico (no annual reports), Nevada (no state income tax)
- Payment processors: Stripe (US/EU/AU), Square, PayPal, Paystack (Africa), Razorpay (India), Mercado Pago (LatAm)
- AI tools 2026: ChatGPT/GPT-5, Claude, Gemini, Midjourney v7, Sora, ElevenLabs, Descript, Notion AI, Canva AI
- Digital Nomad Visas: 70+ countries (Croatia 18mo tax-free, Portugal D8, UAE Golden, Thailand LTR)
- Neobanks: Mercury, Relay (US), Wise Business (global), Starling/Tide (UK), Moniepoint (Nigeria)
- Marketing 2026: Short-form video dominates, AI-generated content, community-led growth, micro-influencers
- B2B: LinkedIn automation (Apollo, Clay, Instantly), cold email (Lemlist, Smartlead), WhatsApp Business API

OUTPUT FORMAT — Return valid JSON with this exact structure:
{
  "business_name_suggestions": ["Name 1", "Name 2", "Name 3"],
  "business_summary": "2-3 sentence elevator pitch",
  "entity_recommendation": {
    "type": "LLC",
    "state": "Wyoming",
    "why": "Explanation"
  },
  "target_market": {
    "description": "Who the ideal customer is",
    "demographics": "Age, income, location, interests",
    "pain_points": ["Pain 1", "Pain 2", "Pain 3"]
  },
  "revenue_model": {
    "primary": "How they'll make money",
    "pricing_suggestion": "$X/month or $X per unit",
    "secondary_streams": ["Stream 1", "Stream 2"]
  },
  "startup_costs": {
    "total_estimate": "$X - $Y",
    "breakdown": [
      {"item": "Entity formation", "cost": "$77-$247"},
      {"item": "Item 2", "cost": "$X"}
    ]
  },
  "tools_needed": [
    {"tool": "Tool name", "purpose": "What for", "cost": "$X/mo or Free"}
  ],
  "ninety_day_plan": [
    {"week": "Week 1-2", "tasks": ["Task 1", "Task 2"]},
    {"week": "Week 3-4", "tasks": ["Task 1", "Task 2"]},
    {"week": "Month 2", "tasks": ["Task 1", "Task 2"]},
    {"week": "Month 3", "tasks": ["Task 1", "Task 2"]}
  ],
  "agent_roadmap": [
    {"step": 1, "agent": "The Architect", "action": "Complete business plan"},
    {"step": 2, "agent": "Empire Eva", "action": "Form LLC in Wyoming"},
    {"step": 3, "agent": "Brand Kit", "action": "Create brand identity"},
    {"step": 4, "agent": "Doc Builder", "action": "Generate operating agreement"},
    {"step": 5, "agent": "Site Builder", "action": "Build website"},
    {"step": 6, "agent": "Compliance Coach", "action": "Set up filing calendar"},
    {"step": 7, "agent": "Max Credit", "action": "Build personal credit"},
    {"step": 8, "agent": "Biz Builder Brock", "action": "Build business credit"},
    {"step": 9, "agent": "Revenue Rex", "action": "Launch revenue streams"},
    {"step": 10, "agent": "Growth Engine", "action": "Scale to $12K/month"}
  ],
  "competitive_advantages": ["Advantage 1", "Advantage 2"],
  "risks_and_solutions": [
    {"risk": "Risk description", "solution": "How to mitigate"}
  ],
  "revenue_projection": {
    "month_1": "$X",
    "month_3": "$X",
    "month_6": "$X",
    "month_12": "$X",
    "disclaimer": "These are aspirational targets based on similar businesses, not guaranteed outcomes."
  }
}

RULES:
- Be SPECIFIC — real tool names, real prices, real strategies
- Adapt to their country if mentioned
- Include AI KOACHED agents in the roadmap
- Revenue projections are ASPIRATIONAL, never guaranteed
- Make startup costs realistic
- Never use "promise" or "guarantee results"
- If the idea is vague, make smart assumptions and note them`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, country, budget, experience_level } = await req.json();

    if (!idea || typeof idea !== "string" || idea.length < 5 || idea.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Please describe your business idea (5-5000 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Generate a complete business plan for this idea:

BUSINESS IDEA: ${idea}
${country ? `COUNTRY: ${country}` : "COUNTRY: United States (assume if not specified)"}
${budget ? `STARTING BUDGET: ${budget}` : "STARTING BUDGET: Under $500 (assume bootstrapping)"}
${experience_level ? `EXPERIENCE: ${experience_level}` : "EXPERIENCE: Complete beginner (assume no business knowledge)"}

Generate the full JSON business plan. Be specific and actionable. This person may have ZERO business experience — explain everything they need to do.`;

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
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_business_plan",
                description: "Generate a complete business plan from a user's idea",
                parameters: {
                  type: "object",
                  properties: {
                    business_name_suggestions: { type: "array", items: { type: "string" } },
                    business_summary: { type: "string" },
                    entity_recommendation: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        state: { type: "string" },
                        why: { type: "string" },
                      },
                      required: ["type", "state", "why"],
                    },
                    target_market: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        demographics: { type: "string" },
                        pain_points: { type: "array", items: { type: "string" } },
                      },
                      required: ["description", "demographics", "pain_points"],
                    },
                    revenue_model: {
                      type: "object",
                      properties: {
                        primary: { type: "string" },
                        pricing_suggestion: { type: "string" },
                        secondary_streams: { type: "array", items: { type: "string" } },
                      },
                      required: ["primary", "pricing_suggestion", "secondary_streams"],
                    },
                    startup_costs: {
                      type: "object",
                      properties: {
                        total_estimate: { type: "string" },
                        breakdown: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              item: { type: "string" },
                              cost: { type: "string" },
                            },
                            required: ["item", "cost"],
                          },
                        },
                      },
                      required: ["total_estimate", "breakdown"],
                    },
                    tools_needed: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          tool: { type: "string" },
                          purpose: { type: "string" },
                          cost: { type: "string" },
                        },
                        required: ["tool", "purpose", "cost"],
                      },
                    },
                    ninety_day_plan: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          week: { type: "string" },
                          tasks: { type: "array", items: { type: "string" } },
                        },
                        required: ["week", "tasks"],
                      },
                    },
                    agent_roadmap: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          step: { type: "number" },
                          agent: { type: "string" },
                          action: { type: "string" },
                        },
                        required: ["step", "agent", "action"],
                      },
                    },
                    competitive_advantages: { type: "array", items: { type: "string" } },
                    risks_and_solutions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          risk: { type: "string" },
                          solution: { type: "string" },
                        },
                        required: ["risk", "solution"],
                      },
                    },
                    revenue_projection: {
                      type: "object",
                      properties: {
                        month_1: { type: "string" },
                        month_3: { type: "string" },
                        month_6: { type: "string" },
                        month_12: { type: "string" },
                        disclaimer: { type: "string" },
                      },
                      required: ["month_1", "month_3", "month_6", "month_12", "disclaimer"],
                    },
                  },
                  required: [
                    "business_name_suggestions", "business_summary", "entity_recommendation",
                    "target_market", "revenue_model", "startup_costs", "tools_needed",
                    "ninety_day_plan", "agent_roadmap", "competitive_advantages",
                    "risks_and_solutions", "revenue_projection",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "generate_business_plan" } },
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
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
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

    const result = await response.json();
    
    // Extract from tool call response
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const plan = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
      
      return new Response(
        JSON.stringify({ plan }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: try content
    const content = result.choices?.[0]?.message?.content;
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return new Response(
          JSON.stringify({ plan: parsed }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "Failed to parse business plan" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "No plan generated" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Business plan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
