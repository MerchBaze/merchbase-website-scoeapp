import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentId } = await req.json();

    if (!assessmentId) {
      throw new Error("Assessment ID is required");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch assessment data
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (fetchError) throw fetchError;

    let websiteHtml = "";
    
    // Fetch website HTML if URL provided
    if (assessment.website_url) {
      try {
        const response = await fetch(assessment.website_url, {
          headers: {
            'User-Agent': 'MerchBase Assessment Bot/1.0'
          }
        });
        websiteHtml = await response.text();
        // Take first 50KB to avoid token limits
        websiteHtml = websiteHtml.substring(0, 50000);
      } catch (error) {
        console.error("Error fetching website:", error);
        websiteHtml = "Unable to fetch website content";
      }
    }

    // Build AI prompt
    const systemPrompt = `You are a professional web agency analyst. Analyze websites and provide actionable insights with business impact.`;
    
    const userPrompt = `Analyze this website and provide scores and recommendations.

Company: ${assessment.company_name}
Industry: ${assessment.industry}
Stated Problems: ${assessment.frustrations?.join(', ')}
Primary Goal: ${assessment.primary_goal}
Website URL: ${assessment.website_url || 'No website provided'}

${websiteHtml ? `Website HTML (first 50KB):\n${websiteHtml}` : 'No website to analyze - provide general recommendations for their industry.'}

You MUST provide analysis in this EXACT JSON format (no markdown, just pure JSON):
{
  "overall_score": <number 0-100>,
  "performance_score": <number 0-100>,
  "design_score": <number 0-100>,
  "seo_score": <number 0-100>,
  "mobile_score": <number 0-100>,
  "analysis_summary": "<2-3 sentence overview of biggest issues>",
  "recommendations": [
    {
      "category": "Design|Performance|SEO|Mobile|Content",
      "issue": "Specific problem found",
      "impact": "Why this matters for their business",
      "solution": "What MerchBase would do to fix it"
    }
  ]
}

Scoring Guidelines:
- 0-40: Critical issues that are losing business
- 41-70: Needs improvement, missing opportunities
- 71-85: Good but room for optimization
- 86-100: Excellent (be conservative with high scores)

Provide 4-8 specific, actionable recommendations. Focus on business impact, not just technical details.`;

    // Call Lovable AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_website_analysis",
              description: "Provide structured website analysis with scores and recommendations",
              parameters: {
                type: "object",
                properties: {
                  overall_score: { type: "number", minimum: 0, maximum: 100 },
                  performance_score: { type: "number", minimum: 0, maximum: 100 },
                  design_score: { type: "number", minimum: 0, maximum: 100 },
                  seo_score: { type: "number", minimum: 0, maximum: 100 },
                  mobile_score: { type: "number", minimum: 0, maximum: 100 },
                  analysis_summary: { type: "string" },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string" },
                        issue: { type: "string" },
                        impact: { type: "string" },
                        solution: { type: "string" }
                      },
                      required: ["category", "issue", "impact", "solution"]
                    }
                  }
                },
                required: ["overall_score", "performance_score", "design_score", "seo_score", "mobile_score", "analysis_summary", "recommendations"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_website_analysis" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', JSON.stringify(aiData, null, 2));

    // Extract analysis from tool call
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    // Update assessment with results
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        analysis_complete: true,
        overall_score: analysis.overall_score,
        performance_score: analysis.performance_score,
        design_score: analysis.design_score,
        seo_score: analysis.seo_score,
        mobile_score: analysis.mobile_score,
        analysis_summary: analysis.analysis_summary,
        recommendations: analysis.recommendations,
      })
      .eq('id', assessmentId);

    if (updateError) throw updateError;

    // Trigger email sending (non-blocking, fire and forget)
    supabase.functions.invoke("send-assessment-email", {
      body: { assessmentId },
    }).then((emailResp) => {
      console.log("Email trigger response:", emailResp);
    }).catch((emailError) => {
      console.error("Error triggering email:", emailError);
    });

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in analyze-website function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});