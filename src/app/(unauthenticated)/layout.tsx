import Logo from '@/components/application/logo'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const UnauthenticatedLayout = ({ children }: { children: ReactNode }) => {
    const user = false;
    if (user) {
        redirect("/workplace");
    }

    return (
        <section className='w-full h-[100dvh] flex flex-col'>
            <Link href={'/'} className='p-5'>
                <Logo />
            </Link>
            <div className='my-auto'>
                {children}
            </div>
        </section>
    )
}

export default UnauthenticatedLayout