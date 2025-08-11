import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Bitcount_Grid_Double } from 'next/font/google'
import Image from 'next/image'

const dancingScript = Bitcount_Grid_Double({
    variable: "--font-pixel-sans",
    weight: ['400'],
    subsets: ["latin"],
});

const Hero = () => {
    return (
        <main className='p-5 flex-1 flex flex-col lg:flex-row justify-center items-center relative gap-6'>
            <div className="absolute inset-0 pointer-events-none">
                {/* Thick horizontal glow */}
                <div className="absolute top-1/5 lg:top-1/3 left-0 w-full h-[250px] bg-gradient-to-b lg:bg-gradient-to-l from-pink-500/40 via-purple-500/40 to-blue-500/40 blur-[120px]"></div>

                {/* Thick vertical glow */}
                {/* <div className="absolute left-1/2 top-0 h-full w-[200px] bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-[120px]"></div> */}
            </div>

            <section className='lg:w-[40%]'>
                <section>
                    <p className={`scroll-m-20 text-left text-6xl font-extrabold tracking-tight text-balance ${dancingScript.className}`}>Ship features without fear.</p>
                    <p className='leading-7 [&:not(:first-child)]:mt-4'>Feature flags that let you navigate your product releases like a captain — smooth sailing, no surprises</p>
                </section>
                <section className="flex justify-start items-center gap-2 mt-6">
                    <Button variant={'outline'}>
                        <Link href={'https://github.com/Sreejit-Sengupto'} className="flex justify-center items-center gap-1">
                            <span><Github /></span>
                            <span>Github</span>
                        </Link>
                    </Button>
                    <Button>
                        <Link href={'/login'}>
                            Get Started
                        </Link>
                    </Button>
                </section>
            </section>
            <section className=''>
                <Image src={'/pixel_hero.gif'} alt='hero img' width={400} height={400} className='rounded-xl shadow-2xl' />
            </section>
        </main>
    )
}

export default Hero