import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  therapist_Id: string;
  first_name: string;
  last_name: string;
  patient_email: string;
  injury_details: string;
  password: string;
  salt: string;
  exercise_reminder_time: string;
  medicine_reminder_time: string;
  date_of_birth: Date;
  allergy_if_any?: string;
  profile_photo?: string;
  gender: string;
  medical_history?: string;
  created_at: Date;
  updated_at: Date;
}

const PatientSchema: Schema = new Schema({
  therapist_Id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  patient_email: { type: String, required: true, unique: true },
  injury_details: { type: String, required: true },
  password: { type: String, required: false },
  salt: { type: String, required: false, select: false },
  exercise_reminder_time: { type: String, required: true },
  medicine_reminder_time: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  allergy_if_any: { type: String },
  profile_photo: { type: String },
  gender: { type: String, required: true },
  medical_history: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Patient = mongoose.model<IPatient>('Patients', PatientSchema);

export default Patient;
