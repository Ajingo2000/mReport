'use client';
import Image from 'next/image'

export default function PartnersSection() {
  const partners = [
    { name: 'IRC', logo: '/logos/irc.png' },
    { name: 'UNFPA', logo: '/logos/unfpa.png' },
    { name: 'MoH', logo: '/logos/moh.png' },
    { name: 'ACROSS', logo: '/logos/across.png' }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Our Partners</h2>
        <p className="text-gray-600 mt-2">Supported by trusted organizations</p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {partners.map((partner, idx) => (
          <div
            key={idx}
            className="grayscale hover:grayscale-0 transition duration-300 p-2"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              className="h-16 object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}




