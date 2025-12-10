"use client";

import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import myLogo from "@/public/images/favicon.png";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className=""><Image
                src={myLogo}
                alt="Mreport Logo"
                className="w-20 h-20 lg:w-32 lg:h-32"
              /></div>
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
                <Mail className="w-5 h-5 text-orange-500" />
                <a href="mailto:information@mreport.org" className="text-white/80 hover:text-white transition-smooth">
                  information@mreport.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <a href="tel:+211123456789" className="text-white/80 hover:text-white transition-smooth">
                  +211 981 397 395
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
              © 2025  mReport. All rights reserved. Building resilient communities in South Sudan.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-white/60 hover:text-white transition-smooth">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-white/60 hover:text-white transition-smooth">Terms of Service</Link>
              <a href="#" className="text-white/60 hover:text-white transition-smooth">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};