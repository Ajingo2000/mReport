import { Smartphone, MessageSquare, Users } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Smartphone,
      title: "Dial",
      description: "Dial the short USSD code on any phone.",
      step: "01"
    },
    {
      icon: MessageSquare,
      title: "Report",
      description: "Select your language and submit a report in just a few clicks.",
      step: "02"
    },
    {
      icon: Users,
      title: "Respond",
      description: "Reports are instantly shared with first responders for quick action.",
      step: "03"
    }
  ];

  return (
    <section className="py-20 section-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and effective reporting in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="text-center group animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto card-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-smooth">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-soft">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Connection Lines */}
        <div className="hidden md:block relative mt-12">
          <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};