import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gradient">mReport</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Empowering citizens in South Sudan to report infrastructure issues and health emergencies 
              through accessible USSD/SMS technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-smooth">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@mreport.org" className="text-white/80 hover:text-white transition-smooth">
                  info@mreport.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+211123456789" className="text-white/80 hover:text-white transition-smooth">
                  +211 XXX XXX
                </a>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Partners</h4>
            <div className="space-y-2 text-white/80 text-sm">
              <p>UN Agencies</p>
              <p>Local NGOs</p>
              <p>Government Partners</p>
              <p>Community Organizations</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 mReport. All rights reserved. Building resilient communities in South Sudan.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-smooth">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-smooth">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-smooth">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};