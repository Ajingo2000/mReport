import { NAVBAR_HEIGHT } from '@/lib/constants'
import React from 'react'
import Link from 'next/link'
import { Button } from './button'

const Navbar = () => {
    return (
        <div className='fixed top-0 left-0 w-full z-50 shadow-xl' style={{ height: `${NAVBAR_HEIGHT}px` }}>
            <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
                <div className="flex items-center gap-4 md:gap-6">
                    <Link href="/" className='cursor-pointer hover:!text-primary=300' scroll={false}>
                        <div className="flex items-center gap-3">
                            <div className="text-xl font-bold">
                                m
                                <span className='text-secondary-500 font-light hover:!text-primary-300'>Report</span>
                            </div>
                        </div>
                    </Link>
                </div>
                <p className="text-primary-200 hidden md:block">
                    Discover the power of data with MReport, your go-to solution for comprehensive and insightful reporting.
                </p>
                <div className="flex items-center gap-5">
                    <Link href={"/signin"}>
                        <Button variant="outline" className='text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg'>
                            Sign In
                        </Button>
                    </Link>
                    <Link href={"/signup"}>
                        <Button variant="outline" className='text-white border-white bg-transparent bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg'>
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar

