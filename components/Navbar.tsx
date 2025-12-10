"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", id: "hero" },
    { name: "How It Works", id: "how-it-works" },
    { name: "Features", id: "features" },
    { name: "Impact", id: "impact" },
    { name: "Demo", id: "demo" },
    { name: "Partners", id: "partners" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-orange-100 shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center space-x-2 group"
                aria-label="Go to homepage"
              >
                <Image
                  src="/images/favicon.png"
                  alt="mReport Logo"
                  priority
                  width={128} 
                  height={128}
                  className="w-20 h-20 lg:w-32 lg:h-32 object-contain transition-transform group-hover:scale-110"
                />
              </button>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-700 hover:text-orange-600 font-medium text-sm lg:text-base 
                         relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                         after:bg-orange-500 after:transition-all after:duration-300 
                         hover:after:w-full transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-orange-500/25">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-orange-100 bg-white/95 backdrop-blur-lg">
            <div className="px-4 space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:text-orange-600 
                           hover:bg-orange-50 rounded-lg font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-4 space-y-3 border-t border-orange-100">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};