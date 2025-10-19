import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const CTASection = () => {
  const benefits = [
    "Analyze your current online presence.",
    "Identify your biggest opportunities for growth.",
    "Outline a clear path to a website that builds your status and grows your organization."
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-secondary to-primary/5">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Organization Deserves to Be Seen and Respected.
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Stop letting a weak website undermine your authority and drain your potential. The "Joneses" are already online. It's time to not just catch up, but to lead.
        </p>
        
        <div className="bg-card p-8 rounded-xl shadow-xl border border-border mb-8">
          <h3 className="text-2xl font-semibold mb-6">
            Schedule your free, no-obligation Website Assessment. In just 30 minutes, we'll:
          </h3>
          <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground">{benefit}</p>
              </div>
            ))}
          </div>
          <Button variant="hero" size="xl">
            Claim My Free Assessment Now
          </Button>
        </div>
      </div>
    </section>
  );
};
