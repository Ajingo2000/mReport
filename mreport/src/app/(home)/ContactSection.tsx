'use client';

import { Button } from '@/components/ui/button';

export default function ContactSection() {
  return (
    <section className="bg-gray-50 py-20 px-6" id='contact'>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-10">Have questions or want to partner with us? Fill out the form or email us.</p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="p-3 border border-gray-300 rounded-lg md:col-span-2"
          />
          <div className="md:col-span-2 text-center">
            <Button size="lg">Send Message</Button>
          </div>
        </form>
        <p className="text-sm text-gray-500 mt-8">
          Or email us directly at <a href="mailto:info@mreport.org" className="text-blue-600 underline">info@mreport.org</a>
        </p>
      </div>
    </section>
  );
}


