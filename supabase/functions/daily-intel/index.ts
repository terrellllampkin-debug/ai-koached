import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = [
  {
    key: "ai_tools",
    prompt: "List 3-4 of the newest AI tools, platforms, or updates in 2026 that small business owners WORLDWIDE should know about. Include AI agents (OpenClaw, Box Agent, Zendesk AI agents), no-code builders, AI marketing tools, and automation platforms. Mention both US and international tools. Be specific with names and what they do.",
  },
  {
    key: "credit",
    prompt: "List 3-4 current credit building and repair updates for 2026 GLOBALLY: US FICO updates, UK Experian/Equifax changes, Nigeria Credit Direct/CreditRegistry, India CIBIL updates, fintech credit builders like Xente (Uganda), CreditLadder (UK), and new Net-30 vendor programs. Be specific.",
  },
  {
    key: "entity",
    prompt: "List 3-4 current business entity and legal updates for 2026 WORLDWIDE: US BOI reporting, UK Companies House changes, UAE free zone updates, Nigeria CAC digital registration, India MCA updates, EU AI Act enforcement, and any new country adding digital business registration. Be specific.",
  },
  {
    key: "revenue",
    prompt: "List 3-4 current revenue and marketing updates for 2026 GLOBALLY: new payment processors (Paystack, Razorpay, Mercado Pago updates), cross-border payment solutions (Wise, Payoneer), social media algorithm changes, e-commerce trends in Africa/Asia/Europe, and global pricing strategies.",
  },
  {
    key: "funding",
    prompt: "List 3-4 current small business funding updates for 2026 WORLDWIDE: US SBA programs, UK Start Up Loans, AfDB grants for Africa, India MUDRA loans, UAE SME funding, international crowdfunding, and global venture capital trends for underrepresented founders.",
  },
  {
    key: "marketing",
    prompt: "List 3-4 current digital marketing updates for 2026 GLOBALLY: social platforms popular in different regions (WhatsApp Business in Africa, LINE in Japan, WeChat in China), SEO changes, email marketing trends, and content creation AI tools available internationally.",
  },
  {
    key: "global_formation",
    prompt: "List 3-4 updates about starting businesses INTERNATIONALLY in 2026: new digital nomad visa programs (70+ countries now offer them — Croatia 18-month tax-free, Philippines DNV, Portugal D8), best countries for startups (UAE #1, Singapore #2, UK #4), non-resident LLC options (Wyoming, Delaware), and remote business registration updates. Be specific with country names and programs.",
  },
  {
    key: "global_fintech",
    prompt: "List 3-4 updates about INTERNATIONAL fintech and business banking in 2026: best business bank accounts for startups in UK (Starling, Tide), UAE (Wio, Mashreq Neo), Nigeria (Moniepoint, Kuda Business), global neobanks (Mercury, Relay, Wise Business), and cross-border payment innovations. Be specific.",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("business_intel")
      .select("id")
      .eq("intel_date", today)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ message: "Intel already generated for today", date: today }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{ category: string; title: string; content: string }> = [];

    for (const cat of CATEGORIES) {
      try {
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
                {
                  role: "system",
                  content:
                    "You are a GLOBAL business intelligence analyst for AI KOACHED, a platform that helps people worldwide build businesses with AI. Generate actionable, current intel updates covering MULTIPLE COUNTRIES — not just the US. Include updates from Africa, Asia, Europe, Middle East, Caribbean, and Latin America. Format each update as a short paragraph. Be specific with tool names, country names, dates, and actionable advice. Every update should be something a business owner ANYWHERE in the world can act on TODAY.",
                },
                {
                  role: "user",
                  content: `${cat.prompt}\n\nFormat your response as a JSON array of objects with "title" and "content" fields. Each title should be under 80 characters. Each content should be 2-3 sentences max. Return ONLY the JSON array, no other text.`,
                },
              ],
              tools: [
                {
                  type: "function",
                  function: {
                    name: "save_intel",
                    description: "Save business intelligence updates",
                    parameters: {
                      type: "object",
                      properties: {
                        updates: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              content: { type: "string" },
                            },
                            required: ["title", "content"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["updates"],
                      additionalProperties: false,
                    },
                  },
                },
              ],
              tool_choice: { type: "function", function: { name: "save_intel" } },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            const parsed = JSON.parse(toolCall.function.arguments);
            if (parsed.updates) {
              for (const update of parsed.updates) {
                results.push({
                  category: cat.key,
                  title: update.title,
                  content: update.content,
                });
              }
            }
          }
        }

        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`Failed to generate intel for ${cat.key}:`, err);
      }
    }

    if (results.length > 0) {
      const rows = results.map((r) => ({
        category: r.category,
        title: r.title,
        content: r.content,
        intel_date: today,
      }));

      const { error } = await supabase.from("business_intel").insert(rows);
      if (error) {
        console.error("Failed to insert intel:", error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Generated ${results.length} intel updates`,
        date: today,
        categories: [...new Set(results.map((r) => r.category))],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("daily-intel error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
