import { Button } from "@/components/ui/button";
import { Building2, Globe, Shield } from "lucide-react";

export const PartnershipSection = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Us in Building Resilient Communities
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Are you an NGO, government agency, or responder? Partner with us to strengthen 
            disaster response and health services in South Sudan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Building2,
              title: "NGO Partners",
              description: "Collaborate with humanitarian organizations"
            },
            {
              icon: Globe,
              title: "Government Agencies",
              description: "Enhance public service delivery systems"
            },
            {
              icon: Shield,
              title: "Response Teams",
              description: "Connect with first responders and emergency services"
            }
          ].map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {partner.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {partner.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 transition-bounce hover:scale-105"
          >
            Partner With Us
          </Button>
          <p className="text-white/70 text-sm mt-4">
            Contact us to discuss partnership opportunities
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-white/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>
    </section>
  );
};