import React from 'react'
import Home from './dashboard/page'
import { auth } from '@/auth'

const Dashboard = async() => {
  const session = await auth()
  let res = await fetch(`http://localhost:3000/api/reminders/${session?.user?.email}`,{
    next: { revalidate: 60 }
  })
  const data = await res.json()
  return (
    <Home session={session} data={data}/>
  )
}

export default Dashboard