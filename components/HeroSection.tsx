import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";


export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 mt-16 isolate">
      {/* Orange-Yellow Gradient + Blurred Pattern Background */}
      <div className="absolute inset-0 -z-10">
        {/* Subtle dotted pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('images/whitesquare.png')`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Yellowish-Orange gradient that blurs the pattern */}
        <div
          className="absolute inset-0  bg-orange-500 
                     backdrop-blur-xl opacity-90"
        />
      </div>

      {/* Hero Content - Centered */}
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-center min-h-[300px]">
        <div className="text-center max-w-4xl">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-6">
              Reporting Made{" "}
              <span className="text-orange-100">Simple.</span>
              <br className="hidden sm:block" />
              Accessible to Everyone.
            </h1>

            <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              mReport empowers citizens to report GBV and urgent SRHR health needs
              directly from any mobile phone.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href='
              #how-it-works'>

                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 
                         font-semibold shadow-xl hover:scale-105 transition-all duration-300 
                         border-2 border-orange-200"
                >
                  Get Started
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
