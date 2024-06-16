import mongoose, { Document, Schema } from 'mongoose';

interface IAssignment extends Document {
  exercise_id: mongoose.Types.ObjectId;
  patient_id: mongoose.Types.ObjectId;
  assigned_at: Date;
  start_date: Date;
  end_date: Date;
  status?: 'assigned' | 'completed' | 'reviewed';
  is_awaiting_reviews?: boolean;
  patient_video_url?: string;
  patient_exercise_completion_date_time?: Date;
  therapist_id: String;
}

const assignmentSchema: Schema<IAssignment> = new Schema({
  exercise_id: {
    type: Schema.Types.ObjectId,
    ref: 'exercises',
    required: true
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patients',
    required: true
  },
  assigned_at: {
    type: Date,
    default: Date.now
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'completed'],
    default: 'assigned'
  },
  is_awaiting_reviews: {
    type: Boolean,
    default: false
  },
  patient_video_url: {
    type: String,
    required: false
  },
  patient_exercise_completion_date_time: {
    type: Date,
    required: false
  },
  therapist_id: {
    type: String,
    required: false
  }
});

// Create and export the model
const Assignment = mongoose.model<IAssignment>('Assigned Exercise', assignmentSchema);

export default Assignment;
export type { IAssignment };
