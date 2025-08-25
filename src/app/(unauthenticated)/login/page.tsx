import React from 'react'
import Image from 'next/image'
import { Pixelify_Sans } from 'next/font/google';
import AuthenticationForm from '@/components/application/authentication/authentication-form';

const Login = () => {
    return (
        <section className='w-full lg:grid grid-cols-2 place-items-center'>
            <div className="lg:hidden absolute top-1/12 lg:top-1/3 left-0 w-full h-[250px] bg-gradient-to-b lg:bg-gradient-to-l from-pink-500/40 via-purple-500/40 to-blue-500/40 blur-[120px]"></div>
            <section className='w-[90%] lg:w-[60%]'>
                <AuthenticationForm type='login' />
            </section>

            <section className='hidden relative w-full lg:flex justify-center items-center'>
                <div className="absolute top-1/5 lg:top-1/3 left-0 w-full h-[250px] bg-gradient-to-b lg:bg-gradient-to-l from-pink-500/40 via-purple-500/40 to-blue-500/40 blur-[120px]"></div>
                <Image
                    src={"/pixel_hero.gif"}
                    alt="hero img"
                    width={470}
                    height={470}
                    className="rounded-4xl shadow-2xl border border-black"
                />
            </section>
        </section>
    )
}

export default Login