import { Search, Palette, Rocket } from "lucide-react";
import discoverImage from "@/assets/step-discover.jpg";
import designImage from "@/assets/step-design.jpg";
import launchImage from "@/assets/step-launch.jpg";

export const PlanSection = () => {
  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Discover & Strategize",
      description: "Deep dive into your goals and audience. We build strategic tools, not just websites.",
      image: discoverImage,
      imageAlt: "Professional consultation meeting"
    },
    {
      icon: Palette,
      number: "2",
      title: "Design & Develop",
      description: "We handle the technical work, creating a beautiful site that reflects your quality.",
      image: designImage,
      imageAlt: "Designer working on beautiful websites"
    },
    {
      icon: Rocket,
      number: "3",
      title: "Launch & Lead",
      description: "Launch your new site with simple management tools. Watch as you attract clients and lead your field.",
      image: launchImage,
      imageAlt: "Happy client viewing new website"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Our Simple 3-Step "Command Presence" Framework
        </h2>
        
        <div className="max-w-6xl mx-auto space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={step.image} 
                    alt={step.imageAlt} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <step.icon className="w-10 h-10 text-accent flex-shrink-0" />
                  <h3 className="text-3xl font-bold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
