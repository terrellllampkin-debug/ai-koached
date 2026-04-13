import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { reportText } = await req.json();
    if (!reportText || typeof reportText !== "string" || reportText.length < 50) {
      return new Response(JSON.stringify({ error: "Invalid report text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Truncate to 30k chars to fit in context
    const truncated = reportText.slice(0, 30000);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are Fix-It Frankie's Credit Report Analyzer at AI KOACHED. You analyze credit reports and identify ALL errors, inaccuracies, and disputable items.

FOR EACH ERROR FOUND, output a JSON object in this exact format:
{
  "errors": [
    {
      "bureau": "Experian|Equifax|TransUnion|Unknown",
      "account_name": "Name of the account/creditor",
      "error_type": "Wrong Balance|Late Payment Error|Duplicate Account|Wrong Status|Wrong Date|Unauthorized Inquiry|Identity Error|Wrong Credit Limit|Account Not Mine|Other",
      "error_description": "Specific description of what's wrong",
      "dispute_letter": "Complete, ready-to-send dispute letter text addressed to the bureau"
    }
  ],
  "summary": {
    "total_errors": 5,
    "high_priority": 2,
    "estimated_score_impact": "+30-60 points if corrected",
    "recommendations": ["List of action items"]
  }
}

DISPUTE LETTER REQUIREMENTS (2026 FCRA Compliant):
- Include user's placeholder [YOUR NAME], [YOUR ADDRESS], [YOUR SSN LAST 4], [DATE]
- Reference specific account number and creditor
- Cite specific inaccuracy with evidence rationale
- Request investigation under FCRA Section 611
- Request deletion if unverifiable under 2026 FCRA updates
- Include: "Under the 2026 FCRA amendments, furnishers must provide documentation, evidence of accuracy, and validation — not just automated confirmation"
- Professional, specific language — NO generic templates
- Each letter unique to the specific error

ANALYSIS RULES:
- Look for: wrong balances, duplicate accounts, wrong payment statuses, unauthorized inquiries, wrong dates, accounts that don't belong to the person, wrong credit limits, charge-off amount discrepancies
- Check for cross-bureau discrepancies (now high-risk under 2026 FCRA)
- Flag any late payment within the last 7 years that could be disputed
- Flag any collection under $500 (many can be removed)
- Flag any medical debt (new protections in 2026)
- Be thorough — find EVERYTHING disputable

COMPLIANCE: You provide document preparation services only. Never guarantee score improvements. Say "designed to help" not "will fix."

RESPOND ONLY WITH VALID JSON. No markdown, no explanation outside the JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this credit report and find ALL errors, inaccuracies, and disputable items. Generate a unique, FCRA-compliant dispute letter for each error found:\n\n${truncated}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("AI error:", response.status);
      return new Response(JSON.stringify({ error: "Analysis service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse analysis results" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save dispute letters to database using service role
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

    if (parsed.errors && Array.isArray(parsed.errors)) {
      for (const err of parsed.errors) {
        await adminClient.from("dispute_letters").insert({
          user_id: user.id,
          bureau: err.bureau || "Unknown",
          account_name: err.account_name || "Unknown",
          error_type: err.error_type || "Other",
          error_description: err.error_description || "",
          letter_content: err.dispute_letter || "",
          status: "draft",
        });
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
