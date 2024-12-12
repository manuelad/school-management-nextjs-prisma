'use client'


import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'




const LoginPage = () => {

    const { isLoaded, isSignedIn, user } = useUser()

    const router = useRouter()

    useEffect(() => {
        if (isSignedIn) {
            const { role } = user?.publicMetadata
            if (role) router.push(`/${role}`)
        }
    })

    return (
        <div className='h-screen flex items-center justify-center bg-ProskyLight'>
            <SignIn.Root>
                <SignIn.Step name='start' className='bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 items-center'>
                    <h1 className='text-xl font-bold'>School Management</h1>
                    <h2 className='to-gray-400 text-sm self-start'>Sign in to your account</h2>
                    <Clerk.GlobalError className='text-sm text-red-400' />
                    <Clerk.Field name='identifier' className='flex flex-col gap-2'>
                        <Clerk.Label className='text-xs text-gray-500'>UserName</Clerk.Label>
                        <Clerk.Input type='text' required className='p-2 rounded-md ring-1 ring-gray-300' />
                        <Clerk.FieldError className='text-sm text-red-400' />
                    </Clerk.Field>
                    <Clerk.Field name='password' className='flex flex-col gap-2'>
                        <Clerk.Label className='text-xs text-gray-500'>Password</Clerk.Label>
                        <Clerk.Input type='password' required className='p-2 rounded-md ring-1 ring-gray-300' />
                        <Clerk.FieldError className='text-sm text-red-400' />
                    </Clerk.Field>
                    <SignIn.Action submit className='bg-blue-500 text-white my-1 px-4 py-3 w-full rounded-md text-sm'>
                        Sign In
                    </SignIn.Action>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    )
}

export default LoginPage