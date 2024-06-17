import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationReminder extends Document {
  patient_id: mongoose.Types.ObjectId;
  reminder_time: Date;
}

const NotificationReminderSchema: Schema = new Schema({
  patient_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Patient' },
  reminder_time: { type: Date, required: true },
});

const NotificationReminder = mongoose.model<INotificationReminder>('notification_reminder', NotificationReminderSchema);

export default NotificationReminder;
