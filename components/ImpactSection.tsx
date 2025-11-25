import { AlertTriangle, HeartHandshake, Users2 } from "lucide-react";

export const ImpactSection = () => {
  const impacts = [
    { icon: AlertTriangle, title: "Coordinated & Effective Response", description: "Faster allocation of resources where they're needed most.", stat: "60% Faster", statLabel: "Response Time" },
    { icon: HeartHandshake, title: "Health Services", description: "Urgent SRHR, maternal care, and HIV support reports reach responders immediately.", stat: "24/7", statLabel: "Availability" },
    { icon: Users2, title: "Community Empowerment", description: "Every citizen has a voice — even without a smartphone.", stat: "100%", statLabel: "Accessible" },
  ];

  return (
    <section className="py-20 section-gradient">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-black mb-6">Making Every Report Count</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real impact through accessible technology and community collaboration
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-8 group hover:shadow-2xl transition-all border border-orange-100 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600 mb-1">{impact.stat}</div>
                    <div className="text-sm text-gray-600">{impact.statLabel}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{impact.title}</h3>
                <p className="text-gray-600 leading-relaxed">{impact.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-700 font-semibold">Building resilient communities together</span>
          </div>
        </div>
      </div>
    </section>
  );
};