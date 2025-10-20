import consultantImage from "@/assets/consultant.jpg";

export const GuideSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Imagine a Website You're Actually Proud to Share
        </h2>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={consultantImage} 
              alt="Professional web consultant" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <p className="text-xl text-muted-foreground leading-relaxed">
              At <strong className="text-foreground font-semibold">MerchBase</strong>, we transform your digital presence from a source of anxiety into your most powerful asset.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We partner with busy professionals to create websites that win.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
