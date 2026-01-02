'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CalendarIcon, ChevronDownIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'

type Data = {
    _id: String,
    title: String,
    dueTime: String,
    notified: Boolean,
    user_email: String,
    createdAt: String,
}

export default function Home({session, data}:{session: any, data: Data[]}) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [reminders, setReminders] = useState<Data[]>(Array.isArray(data) ? data : [])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('10:30')
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statics, setStatics] = useState({
    completed: 0,
    pending: 0,
    today: 0,
    total: data?.length ?? 0
  })
  const currentHour = new Date().getHours();

  useEffect(()=>{ if (!session) router.push('/auth/signin') },[session])
  
  if (!session) return <div className="dark:bg-slate-900 dark:text-white min-h-screen flex items-center justify-center">you have to login first</div> 

  useEffect(() => {
    setReminders(Array.isArray(data) ? data : [])
  }, [data])

  const getStatics = () => {
    const pending = reminders?.filter((reminder:Data) => reminder.notified === false)
    const completed = reminders?.filter((reminder:Data) => reminder.notified === true)
    const today = reminders?.filter((reminder: Data) => {
      if (!reminder.dueTime) return [];

      const due = new Date(reminder.dueTime);
      const now = new Date();

      return (
        due.getDate() === now.getDate() &&
        due.getMonth() === now.getMonth() &&
        due.getFullYear() === now.getFullYear()
      );
    });
     setStatics({ 
      pending: pending.length, 
      completed: completed.length, 
      today: today.length,
      total: reminders.length 
    })
  }
  
  useEffect(() => { getStatics() }, [reminders])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      toast.error('Please select a date')
      return
    }

    if (!time) {
      toast.error('Please select a time')
      return
    }

    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number)
    const selectedDateTime = new Date(date)
    selectedDateTime.setHours(hours, minutes, 0, 0)

    setLoading(true)
    const loadingToast = toast.loading('Creating reminder...')
    
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          dueTime: selectedDateTime.toISOString(), 
          user_email: session?.user?.email 
        }),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success('Reminder created successfully!')
        setTitle('')
        setDate(undefined)
        setTime('10:30')
        router.refresh()
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-200">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar (unchanged) */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center transition-colors duration-200">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-light">{session?.user?.name.slice(0,1)}</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-white">{session?.user?.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{session?.user?.email}</p>
              <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-3"></div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
              <h2 className="font-serif text-xl text-slate-800 dark:text-white mb-6 font-medium">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-medium">All Reminders</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                  <div className="w-8 h-8 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Today</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                  <div className="w-8 h-8 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <span className="font-medium">Upcoming</span>
                </button>
              </div>
            </div>

            {/* Recent Reminders */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
              <h2 className="font-serif text-xl text-slate-800 dark:text-white mb-6 font-medium">Recent</h2>
              <div className="space-y-4">
                {reminders?.slice(0, 2).map((reminder: any, index: number) => {
                  const dueDate = new Date(reminder.dueTime)
                  const now = new Date()
                  let label = ''
                  let displayDate = ''
                  
                  if (
                    dueDate.getDate() === now.getDate() &&
                    dueDate.getMonth() === now.getMonth() &&
                    dueDate.getFullYear() === now.getFullYear()
                  ) {
                    label = 'Today'
                    displayDate = 'Today'
                  } else {
                    const tomorrow = new Date()
                    tomorrow.setDate(now.getDate() + 1)
                    if (
                      dueDate.getDate() === tomorrow.getDate() &&
                      dueDate.getMonth() === tomorrow.getMonth() &&
                      dueDate.getFullYear() === tomorrow.getFullYear()
                    ) {
                      label = 'Tomorrow'
                      displayDate = 'Tomorrow'
                    } else {
                      label = "Upcoming"
                      displayDate = dueDate.toLocaleDateString()
                    }
                  }

                  const timeString = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                  return (
                    <div
                      key={reminder._id || index}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {reminder.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {displayDate}, {timeString}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs text-white rounded-full font-medium ${
                          label === 'Today'
                            ? 'bg-amber-500'
                            : label === 'Upcoming'
                            ? 'bg-slate-500'
                            : 'bg-slate-400'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Welcome Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-3xl text-slate-800 dark:text-white mb-2 font-medium">
                    Good {currentHour < 12 ? 'Morning' : currentHour < 20 ?'Afternoon' : 'Evening'}, {session?.user?.name.split(" ")[0]}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your reminders today</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif text-slate-800 dark:text-white font-medium">{statics.today}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Reminders Today</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Form Card */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-200">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl text-slate-800 dark:text-white font-medium">Create New Reminder</h2>
                      <p className="text-slate-600 dark:text-slate-400">Add a new task to your schedule</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-serif">
                        Reminder Title
                      </label>
                      <input
                        type="text"
                        placeholder="What do you want to remember?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-600 dark:focus:ring-slate-400 focus:border-slate-600 dark:focus:border-slate-400 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="date-picker" className="px-1 text-slate-700 dark:text-slate-300 font-serif text-sm font-medium">
                          Date & Time
                        </Label>
                        <div className="flex gap-4">
                          {/* Date Picker */}
                          <div className="flex-1">
                            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date-picker"
                                  className={cn(
                                    "w-full justify-between font-normal h-12 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500",
                                    !date && "text-slate-400 dark:text-slate-500"
                                  )}
                                >
                                  {date ? format(date, "PPP") : "Select date"}
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  captionLayout="dropdown"
                                  onSelect={(selectedDate) => {
                                    setDate(selectedDate)
                                    setDatePickerOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          {/* Time Picker */}
                          <div className="flex-1">
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                              <Input
                                type="time"
                                id="time-picker"
                                step="60"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-10 h-12 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-slate-600 dark:focus:ring-slate-400 focus:border-slate-600 dark:focus:border-slate-400 focus:outline-none text-slate-900 dark:text-white [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !date || !time}
                        className={`w-full flex items-center justify-center gap-3 ${
                          loading || !date || !time
                            ? 'bg-slate-800 dark:bg-slate-600 cursor-not-allowed' 
                            : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600'
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                  <h3 className="font-serif text-lg text-slate-800 dark:text-white mb-4 font-medium">Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Reminders</span>
                      </div>
                      <span className="text-lg font-serif font-medium text-slate-800 dark:text-white">{statics.total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completed</span>
                      </div>
                      <span className="text-lg font-serif font-medium text-slate-800 dark:text-white">{statics.completed}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending</span>
                      </div>
                      <span className="text-lg font-serif font-medium text-slate-800 dark:text-white">{statics.pending}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}