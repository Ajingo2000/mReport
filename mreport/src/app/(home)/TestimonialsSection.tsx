'use client';

import { QuoteIcon } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Thanks to mReport+, I was able to get help for my sister when no one else was around.",
      name: "Achan R.",
      location: "Unity State"
    },
    {
      quote: "This system made it easy for us to respond faster to community reports.",
      name: "Health Worker",
      location: "Juba"
    },
    {
      quote: "I gave feedback through my phone after getting help. It felt good to be heard.",
      name: "James L.",
      location: "Torit"
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">What People Are Saying</h2>
        <p className="text-gray-600 mt-2">Real stories from real communities</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <QuoteIcon className="text-blue-500 mb-4" />
            <p className="italic text-gray-700 mb-4">&quot;{item.quote}&quot;</p>
            <p className="text-sm font-medium text-gray-800">- {item.name}, {item.location}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

