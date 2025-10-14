import React from 'react'
import { auth } from '@/auth'
import {SignIn} from './sign-in'
import { SignOut } from '@/components/signout-button'
import Image from 'next/image'
import Link from 'next/link'

const Header = async () => {
  const session = await auth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-full mr-3"></div>
            <h1 className="text-2xl font-light text-gray-900">Reminders</h1>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-900 font-medium text-sm">Dashboard</Link>
            <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Calendar</a>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {session.user?.image && (
                    <img 
                      src={session.user.image || ''} 
                      alt="Profile" 
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {session.user?.email}
                    </span>
                  </div>
                </div>
                <SignOut />
              </div>
            ) : (
              <SignIn />
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header