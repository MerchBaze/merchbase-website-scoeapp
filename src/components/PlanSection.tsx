import { Search, Palette, Rocket } from "lucide-react";

export const PlanSection = () => {
  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Discover & Strategize",
      description: "We start with a deep dive into your goals, your audience, and your unique value. We don't just build a website; we build a strategic tool for growth."
    },
    {
      icon: Palette,
      number: "2",
      title: "Design & Develop",
      description: "This is where the magic happens. We handle all the technical heavy lifting, creating a beautiful, easy-to-use website that reflects the quality of your work and captivates your visitors."
    },
    {
      icon: Rocket,
      number: "3",
      title: "Launch & Lead",
      description: "We launch your new command center and give you the simple tools to manage it. Then we watch as you attract more clients, command higher fees, and become the obvious leader in your field."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Our Simple 3-Step "Command Presence" Framework
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
          We've taken the complexity out of web design and replaced it with a proven process that delivers results.
        </p>
        
        <div className="max-w-5xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col md:flex-row gap-6 items-start bg-card p-8 rounded-xl shadow-lg border border-border"
            >
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <step.icon className="w-8 h-8 text-accent" />
                  <h3 className="text-2xl font-bold">{step.title}</h3>
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
