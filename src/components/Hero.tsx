import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/team-collaboration.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/90" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground max-w-5xl mx-auto leading-tight">
          Stop Losing Clients to a Prettier Website.
        </h1>
        <p className="mb-10 text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
          We build stunning websites that attract clients, build trust, and outshine your competition.
        </p>
        <Button 
          variant="hero" 
          size="xl"
          onClick={() => navigate('/assessment')}
        >
          Take Your Free Website Assessment
        </Button>
      </div>
    </section>
  );
};
