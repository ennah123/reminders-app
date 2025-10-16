import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reminder from '@/models/Reminder';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const reminders = await Reminder.find({ user_email: id }).sort({ dueTime: -1 });
    if (!reminders.length) {
      return NextResponse.json({ message: "No reminders found for this user" });
    }
    return NextResponse.json(reminders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}