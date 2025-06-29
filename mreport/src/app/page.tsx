'use client';

import React from 'react'
import HowItWorksSection from './(home)/HowItWorksSection';
import TestimonialsSection from './(home)/TestimonialsSection';
import ContactSection from './(home)/ContactSection';
import FeaturesSection from './(home)/FeaturesSection';
import HeroSection from './(home)/HeroSection';
import PartnersSection from './(home)/PartnersSection';
import FooterSection from './(home)/FooterSection';
import CallToActionSection from './(home)/CallToActionSection';
import Head from 'next/head';


export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home | mReport</title>
        <meta name="description" content="Live report mapping platform" />
        <link rel="icon" href="/mreport-favicon.png" />
      </Head>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Header */}
      
      <HeroSection/>
    
     <FeaturesSection/>


      {/* Features Section */}
      {/* <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition-all">
            <RocketIcon className="text-blue-500 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">USSD/SMS Reporting</h3>
            <p className="text-sm text-gray-600">Report incidents instantly without internet access using basic phones.</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition-all">
            <ShieldCheckIcon className="text-blue-500 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Secure & Confidential</h3>
            <p className="text-sm text-gray-600">All data is encrypted and anonymized for user safety and compliance.</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition-all">
            <MapIcon className="text-blue-500 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Live Maps & Dashboard</h3>
            <p className="text-sm text-gray-600">Visualize reports and feedback on an interactive real-time map.</p>
          </div>
        </div>
      </section> */}

      <HowItWorksSection />
      <TestimonialsSection />
      <PartnersSection />

      <CallToActionSection/>

      {/* Call to Action */}
      {/* <section className="px-6 py-20 text-center bg-blue-50">
        <h3 className="text-2xl font-bold mb-4">Join the movement to strengthen community response</h3>
        <p className="text-gray-600 mb-6">Help us ensure no voice goes unheard and no need unmet.</p>
        <Button size="lg">Request a Demo</Button>
      </section> */}

      <ContactSection />

      {/* Footer */}
      <FooterSection />
    </div>

    </>
  );
}
// This is a simple landing page for the mReport+ platform, showcasing its features and encouraging user engagement.
