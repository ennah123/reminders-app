import React from 'react'
import {SignIn} from './sign-in'

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded-full mr-3"></div>
              <h1 className="text-2xl font-light text-gray-900">Reminders</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 font-medium text-sm">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Calendar</a>
              {/* <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Settings</a> */}
              <SignIn/>
            </nav>
          </div>
        </div>
    </header>
  )
}

export default Header