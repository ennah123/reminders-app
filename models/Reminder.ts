import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dueTime: {
    type: Date,
    required: true
  },
  notified: {
    type: Boolean,
    default: false
  },
  user_email: { 
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// delete mongoose.models.Reminder;
// delete mongoose.connection.collections.reminders;

export default mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);