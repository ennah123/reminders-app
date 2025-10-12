import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import nodemailer from 'nodemailer'
import { generateSimpleReminderEmail } from '@/app/templates/emailTemplates'
const prisma = new PrismaClient()

if (!process.env.EMAIL_AUTH_USER || !process.env.EMAIL_AUTH_PASS) {
  console.error('❌ Missing email credentials in environment variables')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error)
  } else {
    console.log('✅ Email transporter is ready')
  }
})

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date()
    console.log(`🕒 Checking reminders at ${now.toISOString()}`)

    const dueReminders = await prisma.reminder.findMany({
      where: { 
        dueTime: { lte: now }, 
        notified: false 
      },
    })

    for (const reminder of dueReminders) {
      try {
        console.log(`📧 Sending email for: ${reminder.title}`)
        const htmlContent = generateSimpleReminderEmail({
          title: reminder.title,
          dueTime: reminder.dueTime
        })
        
        await transporter.sendMail({
          from: `"Reminders App" <${process.env.EMAIL_AUTH_USER}>`,
          to: '123ennah@gmail.com',
          subject: `Reminder: ${reminder.title}`,
          text: `⏰ Your reminder "${reminder.title}" is due now!`,
          html: htmlContent
        })

        console.log(`Email sent for: ${reminder.title}`)
        
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { notified: true },
        })

      } catch (emailError) {
        console.error(`Failed to process reminder ${reminder.id}:`, emailError)
      }
    }

  } catch (error) {
    console.error('Cron job error:', error)
  }
})

console.log('Cron job running every minute...')