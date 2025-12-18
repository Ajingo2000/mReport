import { Button } from "@/components/ui/button";
import { Building2, Globe, Shield } from "lucide-react";

export const PartnershipSection = () => {
  return (
    <section className="py-20 bg-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl  text-black mb-6 drop-shadow-lg">
            Join Us in Building Resilient Communities
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
            Are you an NGO, government agency, or responder? Partner with us...
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[{ icon: Building2, title: "NGO Partners" }, { icon: Globe, title: "Government Agencies" }, { icon: Shield, title: "Response Teams" }].map((partner, i) => {
            const Icon = partner.icon;
            return (
              <div key={i} className="text-center animate-scale-in" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Icon className="w-8 h-8 text-orange-300" />
                </div>
                <h3 className="text-lg  text-black mb-2">{partner.title}</h3>
                <p className="text-black text-sm">Collaborate to make a difference</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="hero"
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xl hover:shadow-orange-500/40 transition-all hover:scale-105"
          >
            Partner With Us
          </Button>
          <p className="text-black text-sm mt-4">Contact us to discuss partnership opportunities</p>
        </div>
      </div>
    </section>
  );
};