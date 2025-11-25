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
              Experience our multi-channel reporting system for GBV and SRHR issues, including simple USSD, WhatsApp messaging, and Facebook Messenger – making safe, accessible reporting available to everyone, anywhere.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* USSD Phone Mockup */}
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
                          <span>1. Report GBV Incident</span>
                          <span>→</span>
                        </div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                          <span>2. Report SRHR Concern</span>
                          <span>→</span>
                        </div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                          <span>3. Get Support Resources</span>
                          <span>→</span>
                        </div>
                        <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                          <span>4. Language Settings</span>
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
             
              {/* Floating Indicators */}
              <div className="absolute -top-4 -left-4 bg-orange-500 text-secondary-foreground rounded-lg px-3 py-2 text-xs ">
                🇬🇧 English
              </div>
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-accent-foreground rounded-lg px-3 py-2 text-xs " style={{animationDelay: '1.5s'}}>
                📡 No Internet Required
              </div>
              <div className="absolute top-12 right-0 bg-yellow-500 text-white rounded-lg px-3 py-2 text-xs animate-pulse">
                Sandbox Environment
              </div>
            </div>

            {/* WhatsApp Chat Mockup with Redirect */}
            <a 
              href="https://wa.me/+211981397395" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative mx-auto animate-scale-in block hover:opacity-90 transition-opacity" 
              style={{animationDelay: '0.2s'}}
            >
              <div className="w-72 h-96 bg-gray-800 rounded-3xl p-4 shadow-hero">
                <div className="w-full h-full bg-gray-900 rounded-2xl flex flex-col">
                  {/* WhatsApp Header */}
                  <div className="bg-green-600 text-white p-3 rounded-t-2xl flex items-center">
                    <div className="flex-1 text-center text-sm font-medium">
                      mReport Bot
                    </div>
                    <div className="text-xs opacity-80">+211981397395</div>
                  </div>
                 
                  {/* Chat Content */}
                  <div className="flex-1 bg-white text-gray-800 p-4 rounded-b-2xl space-y-3 overflow-y-auto">
                    <div className="bg-gray-100 p-2 rounded-lg text-sm self-start max-w-[80%]">
                      Hi! Welcome to mReport on WhatsApp. How can I help? Reply with:
                      1. Report GBV
                      2. Report SRHR
                      3. Get Resources
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg text-sm self-end max-w-[80%]">
                      1
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg text-sm self-start max-w-[80%]">
                      Okay, let's report a GBV incident safely. Describe the issue briefly:
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Floating Indicators */}
              <div className="absolute -top-4 -left-4 bg-orange-500 text-secondary-foreground rounded-lg px-3 py-2 text-xs ">
                🔒 End-to-End Encrypted
              </div>
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-accent-foreground rounded-lg px-3 py-2 text-xs " style={{animationDelay: '1.5s'}}>
                📱 Familiar Chat Interface
              </div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-lg px-3 py-2 text-xs animate-bounce">
                Click to Chat on WhatsApp
              </div>
            </a>

            {/* Facebook Messenger Mockup with Under Development Highlight */}
            <div className="relative mx-auto animate-scale-in opacity-70" style={{animationDelay: '0.4s'}}>
              <div className="w-72 h-96 bg-gray-800 rounded-3xl p-4 shadow-hero">
                <div className="w-full h-full bg-gray-900 rounded-2xl flex flex-col">
                  {/* Facebook Header */}
                  <div className="bg-blue-600 text-white p-3 rounded-t-2xl flex items-center">
                    <div className="flex-1 text-center text-sm font-medium">
                      mReport Messenger
                    </div>
                    <div className="text-xs opacity-80">Active now</div>
                  </div>
                 
                  {/* Chat Content */}
                  <div className="flex-1 bg-white text-gray-800 p-4 rounded-b-2xl space-y-3 overflow-y-auto">
                    <div className="bg-gray-100 p-2 rounded-lg text-sm self-start max-w-[80%]">
                      Hello! This is mReport on Facebook. Select an option:
                      - Report GBV
                      - Report SRHR
                      - Support Info
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg text-sm self-end max-w-[80%]">
                      Report GBV
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg text-sm self-start max-w-[80%]">
                      Understood. Please provide details anonymously. Your safety is our priority.
                    </div>
                  </div>
                </div>
              </div>
             
              {/* Floating Indicators */}
              <div className="absolute -top-4 -left-4 bg-orange-500 text-secondary-foreground rounded-lg px-3 py-2 text-xs ">
                👥 Community Connected
              </div>
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-accent-foreground rounded-lg px-3 py-2 text-xs " style={{animationDelay: '1.5s'}}>
                🌐 Social Integration
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-lg px-4 py-3 text-sm font-bold rotate-12 animate-pulse shadow-lg">
                Under Development
              </div>
            </div>
          </div>

          {/* Feature Highlights - Now below the mockups for better flow */}
          <div className="mt-16 space-y-8 lg:max-w-3xl mx-auto">
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                USSD: Universal Offline Access (Sandbox)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dial *123# on any mobile phone for instant, text-based reporting of GBV or SRHR issues. No internet or app needed – perfect for remote areas or basic phones. Currently in sandbox environment for testing.
              </p>
            </div>
           
            <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                WhatsApp: Secure Conversational Reporting
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Message our bot at +211981397395 on WhatsApp for guided, encrypted chats to report GBV/SRHR concerns. Share details step-by-step in a familiar interface, with multimedia support for evidence if needed. Click the demo to start chatting.
              </p>
            </div>
           
            <div className="animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Facebook Messenger: Community-Driven Support (Under Development)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Use Facebook Messenger to connect with mReport for quick, anonymous GBV/SRHR reports. Leverage social networks for awareness while ensuring private, responsive assistance. This feature is currently under development.
              </p>
            </div>
           
            <div className="animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Multi-Language & Instant Response
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                All channels support English, Arabic, and Kiswahili. Reports are instantly routed to our network for rapid, confidential support and action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
