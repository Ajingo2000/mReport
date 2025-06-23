import React from 'react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import DiscoverSection from './DiscoverSection'
import CallToActionSection from './CallToActionSection'

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      {/* Add more sections as needed */}
    </div>
  )
}

export default Landing