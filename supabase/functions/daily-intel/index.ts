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
    prompt: "List 3-4 of the newest AI tools, platforms, or updates in 2026 that small business owners should know about. Include automation tools, AI agents, no-code builders, and AI marketing tools. Be specific with names and what they do.",
  },
  {
    key: "credit",
    prompt: "List 3-4 current credit building and repair updates for 2026: new credit card offers, changes to FICO scoring, new Net-30 vendor programs, credit bureau updates, or new fintech credit products. Be specific.",
  },
  {
    key: "entity",
    prompt: "List 3-4 current business entity and legal updates for 2026: new state filing changes, beneficial ownership reporting (BOI) updates, IRS changes, new LLC/Corp regulations, or tax law changes affecting small businesses.",
  },
  {
    key: "revenue",
    prompt: "List 3-4 current revenue and marketing updates for 2026: new payment processors, social media algorithm changes, e-commerce trends, pricing strategies, new sales funnel tools, or ad platform updates.",
  },
  {
    key: "funding",
    prompt: "List 3-4 current small business funding updates for 2026: new SBA loan programs, grant opportunities, crowdfunding platforms, venture capital trends, or alternative lending options.",
  },
  {
    key: "marketing",
    prompt: "List 3-4 current digital marketing updates for 2026: new social platforms, SEO changes, email marketing trends, influencer marketing shifts, or content creation AI tools.",
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

    // Check if we already generated intel today
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

    // Generate intel for each category
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
                    "You are a business intelligence analyst for AI KOACHED, a platform that helps people build businesses with AI. Generate actionable, current intel updates. Format each update as a short paragraph. Be specific with tool names, dates, and actionable advice. Do NOT use generic filler. Every update should be something a business owner can act on TODAY.",
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

        // Small delay between requests to avoid rate limits
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`Failed to generate intel for ${cat.key}:`, err);
      }
    }

    // Insert all intel into database
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
