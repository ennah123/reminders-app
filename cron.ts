import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'

const prisma = new PrismaClient()

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date()

  const dueReminders = await prisma.reminder.findMany({
    where: { dueTime: { lte: now }, notified: false },
  })

  for (const reminder of dueReminders) {
    console.log(`🔔 Reminder: ${reminder.title}`)
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { notified: true },
    })
  }
})

console.log('✅ Cron job running every minute...')
