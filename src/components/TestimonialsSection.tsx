import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import markAvatar from "@/assets/avatar-mark.jpg";
import sarahAvatar from "@/assets/avatar-sarah.jpg";
import benAvatar from "@/assets/avatar-ben.jpg";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "MerchBase built us a professional site that generated a 50% increase in qualified leads in six months. Best investment we've made.",
      author: "Mark R.",
      role: "Senior Partner at Sterling Accounting",
      avatar: markAvatar
    },
    {
      quote: "MerchBase gave us a beautiful site that's become our community's heart. We've seen significant new member engagement.",
      author: "Pastor Sarah L.",
      role: "Community Grace Church",
      avatar: sarahAvatar
    },
    {
      quote: "The website made us look like a million bucks. The positive feedback from parents and the board has been overwhelming.",
      author: "Dr. Ben G.",
      role: "Superintendent of Westfield Schools",
      avatar: benAvatar
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
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-accent/20"
                  />
                  <Quote className="w-8 h-8 text-accent" />
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic text-center">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4 text-center">
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
