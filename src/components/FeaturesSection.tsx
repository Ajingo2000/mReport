import { Globe, MapPin, Heart, Smartphone } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Multilingual Access",
      description: "Available in English, Arabic, and Kiswahili.",
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: "Real-Time Mapping",
      description: "Live dashboard that maps reports for faster response.",
      color: "text-secondary"
    },
    {
      icon: Heart,
      title: "Community-Centered",
      description: "Designed for citizens, responders, and NGOs working together.",
      color: "text-accent"
    },
    {
      icon: Smartphone,
      title: "No Internet Needed",
      description: "Works on any mobile phone via USSD/SMS.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for accessibility, reliability, and community empowerment
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card-gradient rounded-xl p-6 text-center group hover:shadow-hero transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-smooth">
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};