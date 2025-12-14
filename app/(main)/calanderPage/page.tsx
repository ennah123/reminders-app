'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Data = {
    _id: string,
    title: string,
    dueTime: string,
    notified: boolean,
    user_email: string,
    createdAt: string,
}

export default function CalendarPage({ session, data }: { session: any, data: Data[] }) {
    const router = useRouter()
    useEffect(() => { if (!session) router.push('/auth/signin') }, [session])
    
    if (!session) return <div className="dark:bg-slate-900 dark:text-white min-h-screen flex items-center justify-center">you have to login first</div> 
    
    const [reminders, setReminders] = useState<Data[]>(Array.isArray(data) ? data : [])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    useEffect(() => {
        setReminders(Array.isArray(data) ? data : [])
    }, [data])
    
    // Get reminders for a specific date
    const getRemindersForDate = (date: Date) => {
        return reminders.filter((reminder: Data) => {
            if (!reminder.dueTime) return false
            const dueDate = new Date(reminder.dueTime)
            return (
                dueDate.getDate() === date.getDate() &&
                dueDate.getMonth() === date.getMonth() &&
                dueDate.getFullYear() === date.getFullYear()
            )
        })
    }

    // Get reminders for selected date
    const selectedDateReminders = getRemindersForDate(selectedDate)

    // Calendar generation functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const getMonthName = (date: Date) => {
        return date.toLocaleString('default', { month: 'long' })
    }

    const getWeekdays = () => {
        return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }

    const generateCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDayOfMonth = getFirstDayOfMonth(currentDate)
        const days = []

        // Previous month's days
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        const daysInPrevMonth = getDaysInMonth(prevMonth)
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
                isCurrentMonth: false
            })
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
                isCurrentMonth: true
            })
        }

        // Next month's days
        const totalCells = 42 // 6 weeks
        const remainingDays = totalCells - days.length
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
                isCurrentMonth: false
            })
        }

        return days
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev)
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    const isSelected = (date: Date) => {
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-200">
            {/* Main Content px-6 py-12*/}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Sidebar - Hidden on mobile, shown on lg screens */}
                    <div className="hidden lg:block lg:col-span-1 space-y-6">
                        {/* User Profile Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center transition-colors duration-200">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-white text-xl font-light">{session?.user?.name?.slice(0,1)}</span>
                            </div>
                            <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-white">{session?.user?.name}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{session?.user?.email}</p>
                            <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-3"></div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                            <h2 className="font-serif text-xl text-slate-800 dark:text-white mb-6 font-medium">Calendar Overview</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Selected Day</span>
                                    </div>
                                    <span className="text-lg font-serif font-medium text-slate-800 dark:text-white">
                                        {selectedDate.getDate()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Reminders</span>
                                    </div>
                                    <span className="text-lg font-serif font-medium text-slate-800 dark:text-white">
                                        {selectedDateReminders.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Selected Date Reminders */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                            <h2 className="font-serif text-xl text-slate-800 dark:text-white mb-6 font-medium">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h2>
                            <div className="space-y-3">
                                {selectedDateReminders.length > 0 ? (
                                    selectedDateReminders.map((reminder, index) => {
                                        const dueDate = new Date(reminder.dueTime)
                                        const timeString = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        
                                        return (
                                            <div
                                                key={reminder._id || index}
                                                className={`p-3 rounded-lg border transition-colors duration-200 ${
                                                    reminder.notified
                                                        ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'
                                                        : 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">
                                                            {reminder.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {timeString}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                        reminder.notified
                                                            ? 'bg-slate-500 text-white'
                                                            : 'bg-amber-500 text-white'
                                                    }`}>
                                                        {reminder.notified ? 'Done' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">No reminders for this day</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Calendar Area - Full width on mobile */}
                    <div className="lg:col-span-3">
                        {/* Calendar Header */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-8 mb-6 sm:mb-8 transition-colors duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-slate-800 dark:text-white mb-1 sm:mb-2 font-medium">
                                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Tap a date to view reminders
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={goToToday}
                                        className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                                    >
                                        Today
                                    </button>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <button
                                            onClick={() => navigateMonth('prev')}
                                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => navigateMonth('next')}
                                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-6 lg:p-8 transition-colors duration-200">
                            {/* Weekday Headers - Compact on mobile */}
                            <div className="grid grid-cols-7 gap-1 mb-3 sm:mb-4">
                                {getWeekdays().map((day, index) => (
                                    <div key={index} className="text-center text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days - Modern with Rounded Borders */}
                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {generateCalendar().map((day, index) => {
                                    const dayReminders = getRemindersForDate(day.date)
                                    const isTodayDate = isToday(day.date)
                                    const isSelectedDate = isSelected(day.date)
                                    const hasReminders = dayReminders.length > 0
                                    const isOtherMonth = !day.isCurrentMonth
                                    
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedDate(day.date)}
                                            className={`
                                                relative aspect-square min-h-[52px] sm:min-h-[64px]
                                                flex flex-col items-center justify-start p-2
                                                rounded-xl border transition-all duration-200
                                                ${isSelectedDate
                                                    ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-sm'
                                                    : isTodayDate
                                                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600'
                                                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'
                                                }
                                                ${isOtherMonth ? 'opacity-40' : ''}
                                                focus:outline-none focus:ring-2 focus:ring-slate-400/30
                                                group
                                            `}
                                        >
                                            {/* Date Number */}
                                            <div className="w-full flex justify-between items-start mb-1">
                                                <span
                                                    className={`
                                                        absolute top-2 left-2
                                                        text-xs font-semibold

                                                        ${isSelectedDate 
                                                        ? 'text-slate-600 dark:text-slate-400' 
                                                        : isTodayDate
                                                        ? 'text-slate-900 dark:text-white'
                                                        : 'text-slate-700 dark:text-slate-300'
                                                        }
                                                    `}
                                                    >
                                                    {day.date.getDate()}
                                                </span>
                                            </div>
                                            
                                            {/* Reminder Indicator */}
                                        {hasReminders && !isOtherMonth && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div
                                                    className={`
                                                        relative w-10 h-10 rounded-full flex items-center justify-center
                                                        transition-all duration-300
                                                        ${isSelectedDate 
                                                        ? 'bg-slate-50 dark:bg-slate-900/20'
                                                        : 'bg-slate-50 dark:bg-slate-700/30 group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50'
                                                        }
                                                    `}
                                                    >
                                                    <svg 
                                                        className={`
                                                        w-5 h-5 transition-colors
                                                        ${isSelectedDate 
                                                            ? 'text-slate-600 dark:text-slate-400'
                                                            : 'text-slate-600 dark:text-slate-400'
                                                        }
                                                        `} 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="1.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                                        />
                                                    </svg>

                                                    {/* Count badge */}
                                                    <span
                                                        className={`
                                                        absolute -top-1 -right-1
                                                        min-w-[20px] h-5 px-1.5 text-xs font-semibold
                                                        rounded-full flex items-center justify-center
                                                        border-2 border-white dark:border-slate-800
                                                        ${isSelectedDate 
                                                            ? 'bg-slate-500 text-white'
                                                            : 'bg-slate-600 text-white dark:bg-slate-500'
                                                        }
                                                        `}
                                                    >
                                                        {dayReminders.length}
                                                    </span>
                                                    </div>
                                                </div>
                                            )}

                                            
                                            {/* Empty state for current month */}
                                            {!hasReminders && !isOtherMonth && (
                                                <div className="flex-1 flex items-center justify-center opacity-30">
                                                    <svg 
                                                        className="w-4 h-4 text-slate-400 dark:text-slate-600" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="1.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" 
                                                            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Mobile Selected Date Panel - Only show on mobile */}
                        <div className="lg:hidden bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mt-6 transition-colors duration-200">
                            <h3 className="font-serif text-lg text-slate-800 dark:text-white mb-4 font-medium">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <div className="space-y-3">
                                {selectedDateReminders.length > 0 ? (
                                    selectedDateReminders.map((reminder, index) => {
                                        const dueDate = new Date(reminder.dueTime)
                                        const timeString = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        
                                        return (
                                            <div
                                                key={reminder._id || index}
                                                className={`p-3 rounded-lg border transition-colors duration-200 ${
                                                    reminder.notified
                                                        ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'
                                                        : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-800 dark:text-white mb-1">
                                                            {reminder.title}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {timeString}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                        reminder.notified
                                                            ? 'bg-slate-500 text-white'
                                                            : 'bg-amber-500 text-white'
                                                    }`}>
                                                        {reminder.notified ? 'Done' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">No reminders for this day</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}