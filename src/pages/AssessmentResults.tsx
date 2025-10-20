import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import markAvatar from "@/assets/avatar-mark.jpg";
import sarahAvatar from "@/assets/avatar-sarah.jpg";

interface Recommendation {
  category: string;
  issue: string;
  impact: string;
  solution: string;
}

interface Assessment {
  id: string;
  company_name: string;
  overall_score: number;
  performance_score: number;
  design_score: number;
  seo_score: number;
  mobile_score: number;
  analysis_summary: string;
  recommendations: Recommendation[] | any;
  analysis_complete: boolean;
}

export default function AssessmentResults() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!assessmentId) {
        setError("Invalid assessment ID");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", assessmentId)
          .single();

        if (fetchError) throw fetchError;

        if (!data.analysis_complete) {
          // Poll for results every 2 seconds
          const pollInterval = setInterval(async () => {
            const { data: updatedData, error: pollError } = await supabase
              .from("assessments")
              .select("*")
              .eq("id", assessmentId)
              .single();

            if (!pollError && updatedData?.analysis_complete) {
              setAssessment(updatedData);
              setLoading(false);
              clearInterval(pollInterval);
            }
          }, 2000);

          // Stop polling after 30 seconds
          setTimeout(() => {
            clearInterval(pollInterval);
            if (!assessment?.analysis_complete) {
              setError("Analysis is taking longer than expected. Please refresh the page.");
              setLoading(false);
            }
          }, 30000);
        } else {
          setAssessment(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching assessment:", err);
        setError(err.message || "Failed to load assessment results");
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const getScoreColor = (score: number) => {
    if (score >= 86) return "text-green-600";
    if (score >= 71) return "text-yellow-600";
    if (score >= 41) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 86) return "Excellent";
    if (score >= 71) return "Good, but...";
    if (score >= 41) return "Needs Improvement";
    return "Critical - Losing Business";
  };

  const scrollToContact = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Website...</h2>
          <p className="text-muted-foreground">This usually takes 15-30 seconds</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Results</CardTitle>
            <CardDescription>{error || "Assessment not found"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/assessment")}>Start New Assessment</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryScores = [
    { name: "Performance", score: assessment.performance_score, icon: "🚀" },
    { name: "Design", score: assessment.design_score, icon: "🎨" },
    { name: "SEO", score: assessment.seo_score, icon: "🔍" },
    { name: "Mobile", score: assessment.mobile_score, icon: "📱" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Hero Section with Overall Score */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-12 pb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {assessment.company_name} Website Assessment
            </h1>
            <p className="text-muted-foreground mb-8">Your AI-Powered Analysis Results</p>
            
            <div className="inline-block relative">
              <div className={`text-7xl md:text-8xl font-bold ${getScoreColor(assessment.overall_score)}`}>
                {assessment.overall_score}
              </div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground mt-2">
                Overall Score
              </div>
              <div className={`text-lg font-semibold mt-1 ${getScoreColor(assessment.overall_score)}`}>
                {getScoreLabel(assessment.overall_score)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Scores Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categoryScores.map((category) => (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${getScoreColor(category.score)}`}>
                  {category.score}
                </div>
                <Progress value={category.score} className="mt-2 h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Analysis Summary */}
        <Card className="mb-8 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{assessment.analysis_summary}</p>
          </CardContent>
        </Card>

        {/* Detailed Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Biggest Opportunities for Growth</h2>
          <div className="space-y-4">
            {assessment.recommendations?.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertCircle className="h-5 w-5 text-accent" />
                    {rec.category}: {rec.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Why This Matters:
                    </h4>
                    <p>{rec.impact}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                    <h4 className="font-semibold text-sm mb-1">MerchBase Solution:</h4>
                    <p>{rec.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Proof Section */}
        <Card className="mb-8 bg-secondary/20">
          <CardHeader>
            <CardTitle>Companies Like Yours Saw Real Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={markAvatar} alt="Mark R" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Mark R., Accounting Firm</p>
                  <p className="text-sm text-muted-foreground">
                    "50% increase in qualified leads in six months"
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={sarahAvatar} alt="Pastor Sarah" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Pastor Sarah, Community Church</p>
                  <p className="text-sm text-muted-foreground">
                    "Significant new member engagement"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Fix These Issues?
            </h2>
            <p className="text-xl mb-2 opacity-90">
              Stop letting a weak website undermine your authority.
            </p>
            <p className="text-lg mb-8 opacity-90">
              Schedule a free 30-minute implementation call with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="hero"
                className="bg-white text-primary hover:bg-white/90"
                onClick={scrollToContact}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Schedule Implementation Call
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                onClick={() => window.print()}
              >
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}