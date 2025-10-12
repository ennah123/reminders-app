import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: { dueTime: 'asc' }
    })

    return NextResponse.json(reminders)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 })
  }
}

export async function POST(req: Request){
    const {title, dueTime} = await req.json()
    if (!title || !dueTime) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const reminder = await prisma.reminder.create({
        data: { title, dueTime: new Date(dueTime) }
    })

    return NextResponse.json(reminder)
}