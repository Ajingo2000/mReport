import React from 'react'
import Image from 'next/image'

const CallToActionSection = () => {
  return (
    <div className='relative py-24'>
        <Image 
         src={'/landing-call-to-action.jpg'}
         alt='Call to Action Background'
         fill
            className='object-cover object-center'
        />

        <div className="absolute inset-0 bg-black bg-opacity-60">
            
        </div>
    </div>
  )
}

export default CallToActionSection