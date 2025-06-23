// components/HeroSection.tsx or .jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <div className='relative h-screen'>
            <Image
                src='/landing-splash.jpg'
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
                            mReport: Your Data, Your Insights, mFeedback for the Future
                        </h1>
                        <p className="text-xl text-white mb-8">
                            Explore the power of data with mReport. mReport is your go-to solution for comprehensive reporting and analytics. As well as feedback collection and analysis, mReport is designed to help you gather, analyze, and act on feedback effectively. With mReport, you can create custom surveys, collect responses, and gain valuable insights to improve your products and services.
                        </p>

                        <div className="flex justify-center">
                            <Input
                                type="text"
                                value={"search query"}
                                placeholder="Search reports..."
                                onChange={() => {}}
                                className="w-full max-w-lg  rounded-none rounded-l-xl border-none  bg-white h-12"
                            />

                            <Button onClick={() => {}}
                                className="bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12 ">
                                    Search
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
