import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, TrendingUp, Loader2, Clock, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
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
  const [loadingStep, setLoadingStep] = useState(0);
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
          // Animated loading sequence
          const stepInterval = setInterval(() => {
            setLoadingStep((prev) => (prev + 1) % 4);
          }, 2000);

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
              clearInterval(stepInterval);
            }
          }, 2000);

          setTimeout(() => {
            clearInterval(pollInterval);
            clearInterval(stepInterval);
            if (!assessment?.analysis_complete) {
              setError("Analysis is taking longer than expected. Please refresh the page.");
              setLoading(false);
            }
          }, 60000);
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
    if (score >= 86) return "text-emerald-600";
    if (score >= 71) return "text-amber-600";
    if (score >= 41) return "text-orange-600";
    return "text-destructive";
  };

  const getScoreFill = (score: number) => {
    if (score >= 86) return "#10b981";
    if (score >= 71) return "#f59e0b";
    if (score >= 41) return "#f97316";
    return "hsl(var(--destructive))";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 86) return "Strong Foundation";
    if (score >= 71) return "Missing Easy Wins";
    if (score >= 41) return "Losing Ground to Competitors";
    return "Bleeding Clients Daily";
  };

  const getHeadline = (score: number, companyName: string) => {
    if (score >= 86) return `${companyName}, You're Close—But Still Losing Clients`;
    if (score >= 71) return `${companyName}, Your Website Is Holding You Back`;
    if (score >= 41) return `${companyName}, We Found Serious Issues Costing You Business`;
    return `${companyName}, Critical Problems Are Driving Clients Away`;
  };

  const scrollToContact = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const loadingSteps = [
    { text: "Scanning your website...", icon: <TrendingUp className="h-6 w-6" /> },
    { text: "Analyzing design & performance...", icon: <Zap className="h-6 w-6" /> },
    { text: "Checking SEO & mobile experience...", icon: <AlertTriangle className="h-6 w-6" /> },
    { text: "Preparing your report...", icon: <CheckCircle2 className="h-6 w-6" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center text-primary animate-pulse">
                {loadingSteps[loadingStep].icon}
              </div>
              <h2 className="text-2xl font-bold">{loadingSteps[loadingStep].text}</h2>
              <Progress value={(loadingStep + 1) * 25} className="h-2" />
              <p className="text-muted-foreground text-sm">This usually takes 15-30 seconds</p>
            </div>
          </CardContent>
        </Card>
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
    { name: "Performance", score: assessment.performance_score, icon: "🚀", painText: "Slow sites lose 40% of visitors", description: "How fast clients find what they need" },
    { name: "Design", score: assessment.design_score, icon: "🎨", painText: "Outdated design = amateur perception", description: "First impressions that build instant trust" },
    { name: "SEO", score: assessment.seo_score, icon: "🔍", painText: "You're invisible to Google", description: "Can people searching for you actually find you?" },
    { name: "Mobile", score: assessment.mobile_score, icon: "📱", painText: "Mobile-broken sites kill credibility", description: "The experience on phones (70% of traffic)" },
  ];

  const radarData = categoryScores.map(cat => ({
    category: cat.name,
    score: cat.score,
    fullMark: 100,
  }));

  const gaugeData = [{
    name: "Score",
    value: assessment.overall_score,
    fill: getScoreFill(assessment.overall_score),
  }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <Card className="mb-8 border-destructive/20 bg-gradient-to-br from-destructive/5 to-background">
          <CardContent className="pt-12 pb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center leading-tight">
              {getHeadline(assessment.overall_score, assessment.company_name)}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
              See exactly what's driving potential clients away from {assessment.company_name}
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
              {/* Radial Gauge */}
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={gaugeData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarGrid gridType="circle" />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-5xl font-bold ${getScoreColor(assessment.overall_score)}`}>
                    {assessment.overall_score}
                  </div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                </div>
              </div>
              
              {/* Label */}
              <div className="text-center md:text-left">
                <div className={`text-2xl font-bold ${getScoreColor(assessment.overall_score)} mb-2`}>
                  {getScoreLabel(assessment.overall_score)}
                </div>
                <div className="text-muted-foreground">Overall Website Health</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart & Category Scores */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Visual snapshot of your website's strengths and weaknesses</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar dataKey="score" stroke={getScoreFill(assessment.overall_score)} fill={getScoreFill(assessment.overall_score)} fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {categoryScores.map((category) => (
              <Card key={category.name} className={category.score < 50 ? "border-destructive/30" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                          {category.score}
                        </div>
                      </div>
                      {category.score < 70 && (
                        <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {category.painText}
                        </p>
                      )}
                      <Progress value={category.score} className="mt-2 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hard Truth Summary */}
        <Card className="mb-8 border-accent bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-accent" />
              Here's the hard truth about what's happening right now:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed mb-4">{assessment.analysis_summary}</p>
            <p className="text-muted-foreground border-l-4 border-accent pl-4">
              Every day these issues remain unfixed, you're losing qualified clients to competitors who invested in their online presence.
            </p>
          </CardContent>
        </Card>

        {/* Recommendations - Pain-Led */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">What's Costing You Clients Right Now</h2>
          <div className="space-y-4">
            {assessment.recommendations?.map((rec: Recommendation, index: number) => (
              <Card key={index} className="border-l-4 border-l-destructive">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-xl mb-2">Clients are leaving because of {rec.issue.toLowerCase()}</div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded font-normal">
                          {rec.category}
                        </span>
                        {index < 3 && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-normal">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-destructive/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm text-destructive mb-2">
                      💸 What This Costs You:
                    </h4>
                    <p className="text-sm">{rec.impact}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      The Fix:
                    </h4>
                    <p className="text-sm">{rec.solution}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Can typically be fixed in 2-4 weeks</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <Card className="mb-8 bg-secondary/50">
          <CardHeader>
            <CardTitle>Companies Like Yours Saw Real Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={markAvatar} alt="Mark R" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Mark R., Accounting Firm</p>
                  <p className="text-sm text-muted-foreground italic">
                    "We went from invisible to unstoppable. 50% more qualified leads in six months."
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={sarahAvatar} alt="Pastor Sarah" />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Pastor Sarah, Community Church</p>
                  <p className="text-sm text-muted-foreground italic">
                    "The new site brought in families we never would have reached before."
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-0">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Losing Clients to a Better-Looking Website
            </h2>
            <p className="text-lg mb-2 opacity-90 max-w-2xl mx-auto">
              Every week you wait, competitors are capturing the clients that should be yours.
            </p>
            <p className="text-base mb-8 opacity-90 max-w-2xl mx-auto">
              We've already done the analysis—now let's fix what's broken.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="hero"
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={scrollToContact}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Schedule My Free Implementation Call
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                onClick={() => window.print()}
              >
                Email Me This Report
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              ⏰ Next available slot: This week | Limited spots available
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
