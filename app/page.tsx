'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import Header from '@/components/Header'

export default function Home() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const loadingToast = toast.loading('Creating reminder...')
    
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, dueTime: new Date(time).toISOString() }),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success('Reminder created successfully!')
        setTitle('')
        setTime('')
      } else {
        toast.dismiss(loadingToast)
        toast.error('Failed to create reminder. Please try again.')
      }
    } catch (error) {
      console.log(error)
      toast.dismiss(loadingToast)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      {/* <Header/> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-light">JD</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-slate-800">John Doe</h3>
              <p className="text-slate-600 text-sm mt-1">Premium Member</p>
              <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-3"></div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-serif text-xl text-slate-800 mb-6 font-medium">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 group">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-medium">All Reminders</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 group">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Today</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 group">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <span className="font-medium">Upcoming</span>
                </button>
              </div>
            </div>

            {/* Recent Reminders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-serif text-xl text-slate-800 mb-6 font-medium">Recent</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Team Meeting</p>
                    <p className="text-xs text-slate-500 mt-1">Today, 2:00 PM</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-amber-500 text-white rounded-full font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Dentist Appointment</p>
                    <p className="text-xs text-slate-500 mt-1">Tomorrow, 10:00 AM</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-slate-500 text-white rounded-full font-medium">Tomorrow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Welcome Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl text-slate-800 mb-2 font-medium">Good Morning, John</h1>
                  <p className="text-slate-600">Here's what's happening with your reminders today</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif text-slate-800 font-medium">3</p>
                  <p className="text-slate-600 text-sm">Reminders Today</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Form Card */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl text-slate-800 font-medium">Create New Reminder</h2>
                      <p className="text-slate-600">Add a new task to your schedule</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3 font-serif">
                        Reminder Title
                      </label>
                      <input
                        type="text"
                        placeholder="What do you want to remember?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 focus:outline-none text-slate-900 placeholder-slate-400 transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3 font-serif">
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 focus:outline-none text-slate-900 transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 ${
                          loading 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-slate-800 hover:bg-slate-900'
                        } text-white py-4 px-6 font-medium text-sm tracking-wide rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating Reminder...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Reminder
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Stats and Overview */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-serif text-lg text-slate-800 mb-4 font-medium">Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">Total Reminders</span>
                      </div>
                      <span className="text-lg font-serif font-medium text-slate-800">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">Completed</span>
                      </div>
                      <span className="text-lg font-serif font-medium text-slate-800">8</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700">Pending</span>
                      </div>
                      <span className="text-lg font-serif font-medium text-slate-800">4</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                  <h3 className="font-serif text-lg mb-4 font-medium">Productivity</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-slate-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On Time</span>
                        <span>83%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-slate-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}