'use client';

import { SmartphoneIcon, SendIcon, CheckCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: SmartphoneIcon,
      title: "Step 1: Report",
      desc: "Use any phone to report incidents via USSD or SMS."
    },
    {
      icon: SendIcon,
      title: "Step 2: Response",
      desc: "Partner organizations are alerted in real-time."
    },
    {
      icon: CheckCheckIcon,
      title: "Step 3: Feedback",
      desc: "Citizens give feedback on the services received."
    }
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
        <p className="text-gray-600 mt-2">From community to response and back</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="bg-blue-50 p-6 rounded-2xl shadow w-full md:w-1/3 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
          >
            <step.icon className="text-blue-500 mb-4 mx-auto" size={36} />
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

