import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const assessmentSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select an industry"),
  email: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  websiteAge: z.string().optional(),
  satisfactionScore: z.string().optional(),
  frustrations: z.array(z.string()).min(1, "Please select at least one frustration"),
  primaryGoal: z.string().min(1, "Please select a primary goal"),
  competitorsBetter: z.string().min(1, "Please select an option"),
  lostBusiness: z.string().min(1, "Please select an option"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
});

type AssessmentForm = z.infer<typeof assessmentSchema>;

const industries = [
  "Accounting Firm",
  "Church",
  "School",
  "Government",
  "Professional Services",
  "Other"
];

const frustrationOptions = [
  "Not enough leads",
  "Looks outdated",
  "Hard to update",
  "Not mobile-friendly",
  "Poor search visibility",
  "Don't have a website"
];

export default function Assessment() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<AssessmentForm>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      frustrations: [],
    },
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const onSubmit = async (data: AssessmentForm) => {
    setIsSubmitting(true);
    
    try {
      // Insert assessment data
      const { data: assessment, error: insertError } = await supabase
        .from("assessments")
        .insert({
          company_name: data.companyName,
          industry: data.industry,
          email: data.email,
          website_url: data.websiteUrl || null,
          website_age: data.websiteAge || null,
          satisfaction_score: data.satisfactionScore ? parseInt(data.satisfactionScore) : null,
          frustrations: data.frustrations,
          primary_goal: data.primaryGoal,
          competitors_better: data.competitorsBetter === "yes",
          lost_business: data.lostBusiness === "yes",
          budget_range: data.budgetRange,
          timeline: data.timeline,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Call AI analysis edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        "analyze-website",
        {
          body: { assessmentId: assessment.id },
        }
      );

      if (analysisError) throw analysisError;

      // Navigate to results page
      navigate(`/assessment/results/${assessment.id}`);
    } catch (error: any) {
      console.error("Error submitting assessment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit assessment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof AssessmentForm)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["companyName", "industry", "email"];
        break;
      case 2:
        fieldsToValidate = ["websiteUrl", "websiteAge", "satisfactionScore"];
        break;
      case 3:
        fieldsToValidate = ["frustrations", "primaryGoal"];
        break;
      case 4:
        fieldsToValidate = ["competitorsBetter", "lostBusiness"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Free Website Assessment</h1>
          <p className="text-muted-foreground">Get AI-powered insights in under 2 minutes</p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Current Website"}
              {step === 3 && "Goals & Problems"}
              {step === 4 && "Competition"}
              {step === 5 && "Budget & Timeline"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your organization"}
              {step === 2 && "Help us understand your current situation"}
              {step === 3 && "What challenges are you facing?"}
              {step === 4 && "How do you compare to competitors?"}
              {step === 5 && "What are you looking for?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company/Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL (if you have one)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="websiteAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How long have you had this website?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-1">0-1 year</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5+">5+ years</SelectItem>
                              <SelectItem value="none">Don't have a website</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="satisfactionScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How satisfied are you with your current website?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 - Very Unsatisfied</SelectItem>
                              <SelectItem value="2">2 - Unsatisfied</SelectItem>
                              <SelectItem value="3">3 - Neutral</SelectItem>
                              <SelectItem value="4">4 - Satisfied</SelectItem>
                              <SelectItem value="5">5 - Very Satisfied</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="frustrations"
                      render={() => (
                        <FormItem>
                          <FormLabel>What's your primary frustration? (Select all that apply)</FormLabel>
                          <div className="space-y-3">
                            {frustrationOptions.map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="frustrations"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          const updated = checked
                                            ? [...current, option]
                                            : current.filter((value) => value !== option);
                                          field.onChange(updated);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {option}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="primaryGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary goal for new website?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="leads">Generate more leads</SelectItem>
                              <SelectItem value="credibility">Improve credibility</SelectItem>
                              <SelectItem value="showcase">Better showcase services</SelectItem>
                              <SelectItem value="manage">Easier to manage</SelectItem>
                              <SelectItem value="all">All of the above</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 4 && (
                  <>
                    <FormField
                      control={form.control}
                      name="competitorsBetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do competitors have better websites?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="unsure">Not sure</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lostBusiness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Have you lost business due to your website?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="maybe">Maybe</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 5 && (
                  <>
                    <FormField
                      control={form.control}
                      name="budgetRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5k-10k">$5k-$10k</SelectItem>
                              <SelectItem value="10k-20k">$10k-$20k</SelectItem>
                              <SelectItem value="20k-50k">$20k-$50k</SelectItem>
                              <SelectItem value="50k+">$50k+</SelectItem>
                              <SelectItem value="unsure">Not sure yet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-3">1-3 months</SelectItem>
                              <SelectItem value="3-6">3-6 months</SelectItem>
                              <SelectItem value="exploring">Just exploring</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1 || isSubmitting}
                  >
                    Previous
                  </Button>
                  {step < totalSteps ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Analyzing..." : "Get My Results"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}