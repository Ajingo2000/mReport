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
          <h2 className="text-3xl md:text-4xl text-black mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and effective reporting in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center group animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-10 h-10 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-xl">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block relative mt-12">
          <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 transform -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};