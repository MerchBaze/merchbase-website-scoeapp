import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "We thought our work spoke for itself, but our old website was holding us back. MerchBase built us a site that not only looks incredibly professional but has generated a 50% increase in qualified leads in just six months. It's the best investment we've made.",
      author: "Mark R.",
      role: "Senior Partner at Sterling Accounting",
      problem: "Invisibility & Profit"
    },
    {
      quote: "Our previous website was an embarrassment. MerchBase gave us a beautiful, easy-to-update site that has become the heart of our online community. We're no longer the 'best-kept secret' and have seen a significant rise in new member engagement. We finally have a site we're proud to share.",
      author: "Pastor Sarah L.",
      role: "Community Grace Church",
      problem: "Inferiority & Community"
    },
    {
      quote: "We needed to compete with private schools for funding and families. The website MerchBase delivered made us look like a million bucks. The positive feedback from parents and the board has been overwhelming. We've truly modernized our image.",
      author: "Dr. Ben G.",
      role: "Superintendent of Westfield Schools",
      problem: "Status & Image"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          From Invisible to Influential
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:border-accent transition-colors duration-300">
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-accent mb-6" />
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
