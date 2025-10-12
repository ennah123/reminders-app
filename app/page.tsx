'use client'

import { useState } from 'react'

export default function Home() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueTime: new Date(time).toISOString()  }),
    })
    alert('Reminder added!')
    console.log(new Date(time).toString())
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  View All Reminders
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Today's Reminders
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Upcoming
                </button>
              </div>
            </div>

            {/* Recent Reminders */}
            <div className="bg-white rounded-lg p-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Team Meeting</p>
                    <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">Today</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dentist Appointment</p>
                    <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">Tomorrow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-2">Add New Reminder</h2>
                  <p className="text-gray-500 text-sm">
                    Create a reminder to stay organized
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder Title
                    </label>
                    <input
                      type="text"
                      placeholder="What do you want to remember?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 transition-colors duration-200"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 font-medium text-sm tracking-wide transition-colors duration-200"
                    >
                      Create Reminder
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-2xl font-light text-gray-900 mb-1">12</p>
                <p className="text-sm text-gray-500">Total Reminders</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-2xl font-light text-gray-900 mb-1">3</p>
                <p className="text-sm text-gray-500">Today</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-2xl font-light text-gray-900 mb-1">5</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}