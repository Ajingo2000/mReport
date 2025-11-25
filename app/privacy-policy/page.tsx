"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar/>
        <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold dark mb-6"
        >
          Privacy Policy
        </motion.h1>

        <p className="mb-8 text-sm text-gray-500">
          Last updated: November 2025
        </p>

        <section className="space-y-6">
          <p>
            Welcome to <strong>mReport</strong> (“we,” “our,” or “us”). We value your trust and
            are committed to protecting your personal information. This Privacy Policy
            explains how we collect, use, and safeguard the information you provide when
            using our platform through web, USSD, or SMS.
          </p>

          <h2 className="text-xl font-semibold dark mt-8">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Personal Information:</strong> Your name, phone number, email, and
              organization details (if applicable).
            </li>
            <li>
              <strong>Report Data:</strong> Submitted descriptions, categories, location
              coordinates, and optional attachments.
            </li>
            <li>
              <strong>Usage Data:</strong> IP addresses, device type, browser, and access logs.
            </li>
          </ul>

          <h2 className="text-xl font-semibold dark mt-8">2. How We Use Information</h2>
          <p>
            We use collected information to process and visualize real-time reports, notify
            responders, improve platform experience, ensure security, and communicate updates.
            We do not sell or rent your personal data.
          </p>

          <h2 className="text-xl font-semibold dark mt-8">
            3. Data Sharing and Disclosure
          </h2>
          <p>
            We only share limited data with authorized responders, partners, or when required
            by law. All partners are bound by confidentiality agreements.
          </p>

          <h2 className="text-xl font-semibold dark mt-8">4. Data Retention</h2>
          <p>
            We retain data only as long as necessary for reporting and legal compliance.
            You may request deletion at <a href="mailto:privacy@mreport.org" className="text-blue-600 underline">privacy@mreport.org</a>.
          </p>

          <h2 className="text-xl font-semibold dark mt-8">5. Security</h2>
          <p>
            We apply industry-standard encryption, secure servers, and restricted access.
            However, no system is completely immune to breaches.
          </p>

          <h2 className="text-xl font-semibold dark mt-8">6. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Request data access, correction, or deletion.</li>
            <li>Withdraw consent to processing, within operational limits.</li>
          </ul>

          <h2 className="text-xl font-semibold dark mt-8">7. Contact Us</h2>
          <p>
            Email: <a href="mailto:privacy@mreport.org" className="text-blue-600 underline">privacy@mreport.org</a><br />
            Address: Juba, South Sudan
          </p>
        </section>
      </div>
      <Footer/>
    </div>
  );
}
