'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useMemo, useState } from 'react'
import Logo from '../logo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeClosed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface TAuthForm {
    type: "login" | "register"
}

const AuthenticationForm: React.FC<TAuthForm> = ({ type }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const cardTitle = useMemo(() => type === 'login' ? 'Welcome back to' : "We are excited to have you on", [])
    const buttonText = useMemo(() => type === 'login' ? 'Login' : "Register", [])
    const footerText = useMemo(() => type === 'login' ? 'No account? Sign up now' : "Have an account? Login", [])
    const redirectLink = useMemo(() => type === 'login' ? '/register' : "/login", [])

    const toggleShowPassword = () => setShowPassword(prev => !prev)

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex flex-col lg:flex-row text-center justify-center items-center gap-3 text-2xl text-wrap'>
                    <span>{cardTitle}</span>
                    <span><Logo textClasses='text-2xl' hideLogo /></span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <section>
                    {type === 'register' && <div className='flex justify-center items-center gap-2'>
                        <div className='w-full'>
                            <Label className='mb-1'>First name</Label>
                            <Input placeholder='Krishna' />
                        </div>

                        <div className='w-full'>
                            <Label className='mb-1'>Last name</Label>
                            <Input placeholder='Vasudev' />
                        </div>
                    </div>}

                    <div className='w-full my-4'>
                        <Label className='mb-1'>E-mail</Label>
                        <Input placeholder='sreesen@gmail.com' />
                    </div>

                    <div className='w-full my-4 relative'>
                        <Label className='mb-1'>Password</Label>
                        <Input placeholder='ssshhhhh.....' type={showPassword ? 'text' : 'password'} />
                        <button onClick={toggleShowPassword} className='absolute right-2 top-1/2 '>
                            {showPassword ? <Eye className='cursor-pointer' color='gray' size={20} /> : <EyeClosed className='cursor-pointer' color='gray' size={20} />}
                        </button>
                    </div>

                    <Button className='w-full cursor-pointer'>{buttonText}</Button>
                </section>
            </CardContent>

            <section className='flex justify-center items-center gap-2 overflow-hidden'>
                <Separator />
                <p>OR</p>
                <Separator />
            </section>

            <CardFooter className='flex flex-col gap-2 justify-center items-center'>
                <section className='w-full flex flex-col justify-center items-center gap-2'>
                    <Button className='w-full cursor-pointer text-lg' variant={'secondary'} asChild>
                        <p className='flex justify-center items-center gap-1'>
                            <span><SiGoogle /></span>
                            <span>Google</span>
                        </p>
                    </Button>
                    <Button className='w-full cursor-pointer text-lg' variant={'secondary'} asChild>
                        <p className='flex justify-center items-center gap-1'>
                            <span><SiGithub /></span>
                            <span>Github</span>
                        </p>
                    </Button>
                </section>

                <section className='my-4'>
                    <Link href={redirectLink} className='text-blue-400'>{footerText}</Link>
                </section>
            </CardFooter>
        </Card>
    )
}

export default AuthenticationForm