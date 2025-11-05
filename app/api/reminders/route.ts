import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reminder from '@/models/Reminder';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  // const session = await auth()
  // if (!session?.user) return NextResponse.json(401)
  try {
    await dbConnect();

    const reminders = await Reminder.find().sort({ dueTime: 1 });
    return NextResponse.json(reminders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // const session = await auth()
  // if (!session?.user) return NextResponse.json(401)
  try {
    await dbConnect();
    const { title, dueTime, user_email } = await req.json();
    if (!title || !dueTime || !user_email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const reminder = await Reminder.create({
      title,
      dueTime,
      user_email
    });
    revalidatePath('/')
    revalidatePath('/calander')
    return NextResponse.json(reminder);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create reminder' + error}, { status: 500 });
  }
}
