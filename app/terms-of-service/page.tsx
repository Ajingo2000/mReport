"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-16">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-blue-700 mb-6"
                >
                    Terms of Service
                </motion.h1>

                <p className="mb-8 text-sm text-gray-500">
                    Effective date: November 2025
                </p>

                <section className="space-y-6">
                    <p>
                        These Terms of Service govern your use of <strong>mReport</strong> (“we,” “our,” or “us”).
                        By accessing or using the platform, you agree to these terms. If you do not agree,
                        please discontinue use.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">1. Overview</h2>
                    <p>
                        mReport is a digital platform enabling citizens to report infrastructure damage,
                        disasters, and SRHR needs through web, SMS, or USSD. We facilitate connections between
                        communities, responders, and authorities for timely action.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">2. Eligibility</h2>
                    <p>
                        Users must be at least 18 years old or have guardian consent. Organizations must
                        be legitimate entities represented by authorized personnel.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">3. User Responsibilities</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Provide accurate and truthful report information.</li>
                        <li>Avoid misuse, false reporting, or unlawful content submission.</li>
                        <li>Respect privacy and local laws when using mReport.</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">4. Data and Ownership</h2>
                    <p>
                        You retain ownership of submitted reports but grant us a non-exclusive, royalty-free
                        license to use, display, and process them for platform functionality and research.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">5. Intellectual Property</h2>
                    <p>
                        All platform content, design, and software are our property. You may not copy,
                        modify, or redistribute without written consent.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">6. Limitation of Liability</h2>
                    <p>
                        mReport is provided “as is” without warranties. We are not liable for losses or damages
                        arising from platform use, data inaccuracies, or responder actions.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">7. Termination</h2>
                    <p>
                        We may suspend or terminate your account for misuse or legal reasons. You may cease
                        use at any time.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">8. Governing Law</h2>
                    <p>
                        These Terms are governed by the laws of the Republic of South Sudan. Disputes shall be
                        settled in competent courts within South Sudan.
                    </p>

                    <h2 className="text-xl font-semibold text-blue-700 mt-8">9. Contact</h2>
                    <p>
                        Email: <a href="mailto:legal@mreport.org" className="text-blue-600 underline">legal@mreport.org</a><br />
                        Phone: +211 (0)9XX XXX XXX<br />
                        Address: Juba, South Sudan
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
}
