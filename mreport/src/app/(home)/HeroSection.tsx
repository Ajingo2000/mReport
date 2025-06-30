// components/HeroSection.tsx or .jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <div className='relative h-screen'>
            <Image
                src='/incident-report.png'
                alt='mReport data'
                fill
                className='object-cover object-center'
                priority
            />
            <div className='absolute inset-0 bg-black bg-opacity-60'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full'
                >
                    <div className="max-w-4xl mx-auto px-16 sm:px-12 ">
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Real-time Incident Reporting & Community Feedback
                        </h1>
                        <p className="text-xl text-white mb-8">
                            Empowering communities to report GBV, SRHR, and health emergencies from any phone. Closing the loop with actionable feedback.
                        </p>

                        <div className="flex justify-center">
                            

                            <Button onClick={() => {}}
                                className="bg-secondary-500 text-white rounded-xl border-none hover:bg-secondary-600 h-12 ">
                                    Get Started
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
