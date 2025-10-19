import { Ghost, TrendingDown, ShieldAlert } from "lucide-react";

export const ProblemSection = () => {
  const problems = [
    {
      icon: Ghost,
      title: "The Ghost Problem",
      description: "Potential clients are searching for your services right now, but your invisible website means they'll never find you. You're losing leads without even knowing it."
    },
    {
      icon: TrendingDown,
      title: "The Status Problem",
      description: "You see competitors—or even peers in other fields—with beautiful, modern sites. It's embarrassing. You know you offer a better service, but your online presence screams \"outdated.\""
    },
    {
      icon: ShieldAlert,
      title: "The Trust Problem",
      description: "A poor website doesn't just look bad; it erodes trust. People assume you're less competent, less successful, and less professional than you truly are."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Is Your Online Presence Holding You Hostage?
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
          You're an expert at what you do. But when people search for you online, they either can't find you, or they find a website that makes you cringe.
        </p>
        
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
        
        <p className="text-center mt-12 text-lg text-foreground/80 italic max-w-2xl mx-auto">
          It's not just a website. It's your digital front door. And right now, it's either locked or it's falling apart.
        </p>
      </div>
    </section>
  );
};
