import React from 'react'
import { auth } from '@/auth'
import CalendarPage from '../calanderPage/page'

const Dashboard = async() => {
  const session = await auth()
  let res = await fetch(`http://localhost:3000/api/reminders/${session?.user?.email}`,{
    next: { revalidate: 60 }
  })
  const data = await res.json()
  return (
    <CalendarPage session={session} data={data}/>
  )
}

export default Dashboard