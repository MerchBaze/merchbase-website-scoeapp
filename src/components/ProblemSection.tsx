import { Ghost, TrendingDown, ShieldAlert } from "lucide-react";

export const ProblemSection = () => {
  const problems = [
    {
      icon: Ghost,
      title: "The Ghost Problem",
      description: "Potential clients are searching—but your invisible website means they'll never find you."
    },
    {
      icon: TrendingDown,
      title: "The Status Problem",
      description: "Competitors have beautiful sites. Yours looks outdated. Your service deserves better."
    },
    {
      icon: ShieldAlert,
      title: "The Trust Problem",
      description: "A poor website erodes trust. People assume you're less professional than you are."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Is Your Online Presence Holding You Hostage?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <problem.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
