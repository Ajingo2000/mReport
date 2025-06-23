"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RocketIcon, ShieldCheckIcon, MapIcon } from "lucide-react";


// ✅ Just use string paths for images in /public
const dashboardImage = "/dashboard.png";
const analyticsImage = "/analytics.png";
const mapImage = "/mfeedback.png";


const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.2,
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },

}

const FeaturesSection = () => {

    return (
        <motion.div initial="hidden" whileInView={'visible'} viewport={{ once: true }} variants={containerVariants} className='py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-50 ' >
            <div className="max-w-4xl xl:maxw-6xl mx-auto">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-12 w-full">Features</motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
                    {[0, 1, 2].map((index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <FeatureCard
                                imageSrc={[dashboardImage, mapImage, analyticsImage][index]}
                                title={['USSD/SMS Reporting', 'Live Maps & Dashboard', 'Report Analysis & Mapping'][index]}
                                description={["Report incidents instantly without internet access using basic phones.", "Visualize reports and feedback on an interactive real-time map.", "Analyse reports and feedback on insightful charts."][index]}
                                linkText={[<ShieldCheckIcon className="text-blue-500" size={22} />, <RocketIcon className="text-blue-500 " size={22} />, <MapIcon className="text-blue-500" size={22} />] [index]}
                                linkHref={['/', '/', '/'][index]}
                            />
                        </motion.div> 
                    ))}
                </div>
            </div>
        </motion.div>
    )

}

const FeatureCard = ({imageSrc, title, description, linkText, linkHref }: { imageSrc: string, title: string, description: string,  linkText: string, linkHref: string}) => {
    return (
        <div className="text-center bg-blue-50 rounded-2xl px-10 py-2 shadow hover:shadow-lg transition-all">
            <div className="p-4 mb-4 rounded-lg flex items-center justify-center h-48 w-full">
                <Image
                    src={imageSrc}  
                    alt={title}
                    className="h-full w-full object-contain"
                    width={600}
                    height={600}                    
                />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="mb-4">{description}</p>
            <Link href={linkHref} className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 " scroll={false}>
                {linkText}
            </Link>
        </div>
    )
}

export default FeaturesSection