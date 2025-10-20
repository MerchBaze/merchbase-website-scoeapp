import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ctaImage from "@/assets/cta-professional.jpg";

export const CTASection = () => {
  const navigate = useNavigate();
  const benefits = [
    "Analyze your current online presence.",
    "Identify your biggest opportunities for growth.",
    "Outline a clear path to a website that builds your status and grows your organization."
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${ctaImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/95 to-primary/90" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Your Organization Deserves to Be Seen and Respected
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Stop letting a weak website undermine your authority. It's time to lead.
        </p>
        
        <div className="bg-card/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-border">
          <h3 className="text-2xl font-semibold mb-6">
            Free 30-Minute Website Assessment:
          </h3>
          <div className="space-y-4 mb-8 text-left max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <p className="text-lg text-muted-foreground">{benefit}</p>
              </div>
            ))}
          </div>
          <Button variant="hero" size="xl" onClick={() => navigate('/assessment')}>
            Start My Free Assessment
          </Button>
        </div>
      </div>
    </section>
  );
};
