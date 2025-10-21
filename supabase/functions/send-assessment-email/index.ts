import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  assessmentId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentId }: EmailRequest = await req.json();
    console.log(`Processing email for assessment ${assessmentId}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch assessment data
    const { data: assessment, error: fetchError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .single();

    if (fetchError || !assessment) {
      console.error("Error fetching assessment:", fetchError);
      throw new Error("Assessment not found");
    }

    if (assessment.email_sent) {
      console.log("Email already sent for this assessment");
      return new Response(
        JSON.stringify({ message: "Email already sent" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get score label
    const getScoreLabel = (score: number) => {
      if (score >= 86) return "Strong Foundation";
      if (score >= 71) return "Missing Easy Wins";
      if (score >= 41) return "Losing Ground to Competitors";
      return "Bleeding Clients Daily";
    };

    const scoreLabel = getScoreLabel(assessment.overall_score || 0);
    const resultsUrl = `${Deno.env.get("VITE_SUPABASE_URL")?.replace("https://", "https://www.")}/assessment/results/${assessmentId}`;

    // Get top 3 issues
    const recommendations = assessment.recommendations || [];
    const topIssues = recommendations.slice(0, 3);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .score-badge { background: rgba(255,255,255,0.2); display: inline-block; padding: 15px 30px; border-radius: 50px; margin-top: 20px; font-size: 18px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .pain-statement { background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .pain-statement p { margin: 0; color: #991b1b; font-weight: 500; font-size: 16px; }
          .issue { background: #f9fafb; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
          .issue-title { font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 16px; }
          .issue-desc { color: #6b7280; font-size: 14px; margin: 0; }
          .cta-button { display: inline-block; background: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
          .cta-button:hover { background: #1d4ed8; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .ps { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-style: italic; color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Website Assessment Results Are Ready, ${assessment.company_name}</h1>
            <div class="score-badge">Overall Score: ${assessment.overall_score}/100 - ${scoreLabel}</div>
          </div>
          
          <div class="content">
            <div class="pain-statement">
              <p>⚠️ Your website is losing you business right now. Here's what we found...</p>
            </div>

            <h2 style="color: #1f2937; margin-top: 30px;">What's Costing You Clients:</h2>
            
            ${topIssues.map((issue: any) => `
              <div class="issue">
                <div class="issue-title">${issue.issue || issue.category}</div>
                <div class="issue-desc">${issue.impact || issue.solution}</div>
              </div>
            `).join('')}

            <p style="font-size: 16px; margin: 30px 0;">We've identified ${recommendations.length} specific issues that are driving potential clients away from ${assessment.company_name}.</p>

            <div style="text-align: center;">
              <a href="${resultsUrl}" class="cta-button">View Your Full Report</a>
            </div>

            <div class="ps">
              <strong>P.S.</strong> These issues are costing you clients every single day. The sooner you fix them, the sooner you stop losing business to competitors who invested in their online presence.
            </div>
          </div>

          <div class="footer">
            <p><strong>MerchBase</strong></p>
            <p>Building websites that attract clients, build trust, and outshine your competition</p>
            <p style="margin-top: 20px; font-size: 12px;">This email was sent because you requested a free website assessment at MerchBase.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const emailResponse = await resend.emails.send({
      from: "MerchBase <onboarding@resend.dev>",
      to: [assessment.email],
      subject: `Your Website Assessment Results Are Ready, ${assessment.company_name}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update assessment record
    const { error: updateError } = await supabase
      .from("assessments")
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", assessmentId);

    if (updateError) {
      console.error("Error updating assessment:", updateError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-assessment-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
