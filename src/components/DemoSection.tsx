export const DemoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              See mReport in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the simple USSD interface that makes reporting accessible to everyone
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Phone Mockup */}
            <div className="relative mx-auto animate-scale-in">
              <div className="w-72 h-96 bg-gray-800 rounded-3xl p-4 shadow-hero">
                <div className="w-full h-full bg-gray-900 rounded-2xl flex flex-col">
                  {/* Phone Header */}
                  <div className="bg-green-500 text-white p-3 rounded-t-2xl">
                    <div className="text-center text-sm font-medium">
                      USSD Service
                    </div>
                    <div className="text-center text-xs opacity-80">
                      *123# - mReport
                    </div>
                  </div>
                  
                  {/* Menu Content */}
                  <div className="flex-1 bg-white text-gray-800 p-4 rounded-b-2xl">
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-center mb-4">
                        Welcome to mReport
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                          <span>1. Report Infrastructure</span>
                          <span>→</span>
                        </div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                          <span>2. Report Health Emergency</span>
                          <span>→</span>
                        </div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                          <span>3. Language Settings</span>
                          <span>→</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3 mt-4">
                        <div className="text-xs text-gray-500 text-center">
                          English | العربية | Kiswahili
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Language Indicators */}
              <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground rounded-lg px-3 py-2 text-xs animate-float">
                🇬🇧 English
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground rounded-lg px-3 py-2 text-xs animate-float" style={{animationDelay: '1.5s'}}>
                📡 No Internet Required
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-8">
              <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Universal Access
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Works on every mobile phone - from basic feature phones to smartphones. 
                  No app downloads or internet connection required.
                </p>
              </div>
              
              <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Multi-Language Support
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Available in English, Arabic, and Kiswahili to serve South Sudan's 
                  diverse linguistic communities.
                </p>
              </div>
              
              <div className="animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Instant Response
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Reports are immediately transmitted to our response network, 
                  ensuring rapid action when it matters most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};