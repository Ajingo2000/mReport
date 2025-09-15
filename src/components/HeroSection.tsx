import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.png";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-gradient py-20 lg:py-28 mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Reporting Made{" "}
              <span className="text-accent-foreground">Simple.</span>
              <br />
              Accessible to Everyone.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              mReport empowers citizens to report broken infrastructure and urgent health needs 
              directly from any mobile phone — no internet required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="transition-bounce hover:scale-105">
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-hero">
              <img
                src={heroImage}
                alt="People using mobile phones to report community issues in South Sudan"
                className="w-full h-auto animate-float"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-sm animate-float">
              📱 USSD: *123#
            </div>
            <div 
              className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-sm animate-float" 
              style={{ animationDelay: '1s' }}
            >
              🌍 3 Languages
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
    </section>
  );
};