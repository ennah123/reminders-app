'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Header from '@/components/Header'
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
    
    const remindersArray = Array.isArray(data) ? data : []
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Get reminders for a specific date
    const getRemindersForDate = (date: Date) => {
        return remindersArray.filter((reminder: Data) => {
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
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* User Profile Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 text-center transition-colors duration-200">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-white text-xl font-light">{session?.user?.name?.slice(0,1)}</span>
                            </div>
                            <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-white">{session?.user?.name}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{session?.user?.email}</p>
                            <div className="w-12 h-0.5 bg-amber-600 mx-auto mt-3"></div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                            <h2 className="font-serif text-xl text-slate-800 dark:text-white mb-6 font-medium">Quick Actions</h2>
                            <div className="space-y-3">
                                <button 
                                    onClick={goToToday}
                                    className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group"
                                >
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">
                                        <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Go to Today</span>
                                </button>
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 group">
                                    <div className="w-8 h-8 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-600 transition-colors">
                                        <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Add Reminder</span>
                                </button>
                            </div>
                        </div>

                        {/* Selected Date Reminders */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                            <h2 className="font-serif text-xl text-slate-800 dark:text-white mb-6 font-medium">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h2>
                            <div className="space-y-3">
                                {selectedDateReminders.length === 0 ? (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
                                        No reminders for this day
                                    </p>
                                ) : (
                                    selectedDateReminders.map((reminder: Data) => {
                                        const dueDate = new Date(reminder.dueTime)
                                        const timeString = dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        
                                        return (
                                            <div
                                                key={reminder._id}
                                                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                                        {reminder.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        {timeString}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 text-xs text-white rounded-full font-medium ${
                                                        reminder.notified ? 'bg-green-500' : 'bg-amber-500'
                                                    }`}
                                                >
                                                    {reminder.notified ? 'Done' : 'Pending'}
                                                </span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Calendar Area */}
                    <div className="lg:col-span-3">
                        {/* Calendar Header */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-8 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="font-serif text-3xl text-slate-800 dark:text-white mb-2 font-medium">
                                        {getMonthName(currentDate)} {currentDate.getFullYear()}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        View and manage your reminders in calendar view
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={goToToday}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigateMonth('prev')}
                                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => navigateMonth('next')}
                                            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-200">
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {getWeekdays().map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2">
                                {generateCalendar().map((day, index) => {
                                    const dayReminders = getRemindersForDate(day.date)
                                    const isTodayDate = isToday(day.date)
                                    const isSelectedDate = isSelected(day.date)
                                    
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedDate(day.date)}
                                            className={`
                                                min-h-[120px] p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                                                ${isTodayDate 
                                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                                                    : isSelectedDate
                                                    ? 'border-slate-600 dark:border-slate-400 bg-slate-50 dark:bg-slate-700'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }
                                                ${!day.isCurrentMonth ? 'opacity-40' : ''}
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`
                                                    text-sm font-medium
                                                    ${isTodayDate 
                                                        ? 'text-amber-600 dark:text-amber-400' 
                                                        : isSelectedDate
                                                        ? 'text-slate-800 dark:text-white'
                                                        : 'text-slate-600 dark:text-slate-400'
                                                    }
                                                    ${!day.isCurrentMonth ? 'text-slate-400 dark:text-slate-600' : ''}
                                                `}>
                                                    {day.date.getDate()}
                                                </span>
                                                {dayReminders.length > 0 && (
                                                    <span className={`
                                                        w-5 h-5 text-xs flex items-center justify-center rounded-full
                                                        ${isTodayDate 
                                                            ? 'bg-amber-500 text-white' 
                                                            : isSelectedDate
                                                            ? 'bg-slate-600 dark:bg-slate-400 text-white'
                                                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                                                        }
                                                    `}>
                                                        {dayReminders.length}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Reminders for the day */}
                                            <div className="space-y-1">
                                                {dayReminders.slice(0, 3).map((reminder, reminderIndex) => (
                                                    <div
                                                        key={reminderIndex}
                                                        className={`
                                                            text-xs p-1 rounded truncate
                                                            ${reminder.notified
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                                                            }
                                                        `}
                                                    >
                                                        {reminder.title}
                                                    </div>
                                                ))}
                                                {dayReminders.length > 3 && (
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                                        +{dayReminders.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}