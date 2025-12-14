import React from 'react'
import { auth } from '@/auth'
import { SignIn } from './sign-in'
import { SignOut } from '@/components/signout-button'
import Image from 'next/image'
import Link from 'next/link'

const Header = async () => {
  const session = await auth()

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3">
              <Image src={'/logo.svg'} alt='' width={40} height={1} />
            </div>
            <div>
              <h1 className="font-serif text-xl text-slate-800 font-medium">Reminders</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Stay organized, stay productive</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-slate-700 hover:text-slate-900 font-medium text-sm transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              href="/calander" 
              className="text-slate-500 hover:text-slate-700 text-sm transition-colors duration-200"
            >
              Calendar
            </Link>
            
            {/* User Section */}
            {session ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                <div className="flex items-center space-x-3">
                  {session.user?.image && (
                    <div className="relative">
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        width={36}
                        height={36}
                        className="rounded-full border-2 border-slate-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                  {/* <div className="hidden md:flex flex-col text-start">
                    <span className="text-sm font-medium text-slate-800">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {session.user?.email}
                    </span>
                  </div> */}
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <SignOut />
                </div>
              </div>
            ) : (
              <div className="pl-4 border-l border-slate-200">
                <SignIn />
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header