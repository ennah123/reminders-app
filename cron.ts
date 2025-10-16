import { config } from 'dotenv';
config({ path: '.env.local' });

import dbConnect from "@/lib/mongoose";
import cron from 'node-cron'
import nodemailer from 'nodemailer'
import { generateSimpleReminderEmail } from '@/app/templates/emailTemplates'
import Reminder from '@/models/Reminder'
import mongoose from "mongoose";

if (!process.env.EMAIL_AUTH_USER || !process.env.EMAIL_AUTH_PASS) {
  console.error('❌ Missing email credentials in environment variables')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
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
    await dbConnect()
    
    const now = new Date()
    console.log(`🕒 Checking reminders at ${now.toString()}`)

    const dueReminders = await Reminder.find({
      dueTime: { $lte: now },
      notified: false
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
          to: reminder.user_email,
          subject: `Reminder: ${reminder.title}`,
          text: `⏰ Your reminder "${reminder.title}" is due now!`,
          html: htmlContent
        })

        console.log(`Email sent for: ${reminder.title}`)
        
        await Reminder.findByIdAndUpdate(
          reminder._id,
          { notified: true }
        )

        console.log(`Marked as notified: ${reminder.title}`)

      } catch (emailError) {
        console.error(`Failed to process reminder ${reminder._id}:`, emailError)
      }
    }

  } catch (error) {
    console.error('Cron job error:', error)
  }
})

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down cron job...')
  await mongoose.connection.close()
  process.exit(0)
})

console.log('✅ Cron job running every minute...')