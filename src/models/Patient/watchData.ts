import mongoose, { Schema, Document } from 'mongoose';
import { IPatient } from '../Patient/patientModel';

interface ICalories {
  day: string;
  values: number[];
}

interface IHeartRate {
  day: string;
  bpm_minimum: number;
  bpm_maximum: number;
}

interface ISleep {
  day: string;
  awake_hours: number;
  rem_hours: number;
  core_hours: number;
  deep_hours: number;
}

interface IStepCount {
  day: string;
  steps: number;
}

interface IWatchData extends Document {
  patient_id: mongoose.Types.ObjectId | IPatient;
  calories: ICalories[];
  heartRate: IHeartRate[];
  sleep: ISleep[];
  stepCount: IStepCount[];
}

const CaloriesSchema: Schema = new Schema({
  day: { type: String, required: true },
  values: { type: [Number], required: true }
});

const HeartRateSchema: Schema = new Schema({
  day: { type: String, required: true },
  bpm_minimum: { type: Number, required: true },
  bpm_maximum: { type: Number, required: true }
});

const SleepSchema: Schema = new Schema({
  day: { type: String, required: true },
  awake_hours: { type: Number, required: true },
  rem_hours: { type: Number, required: true },
  core_hours: { type: Number, required: true },
  deep_hours: { type: Number, required: true }
});

const StepCountSchema: Schema = new Schema({
  day: { type: String, required: true },
  steps: { type: Number, required: true }
});

const WatchDataSchema: Schema = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patients', required: true },
  calories: { type: [CaloriesSchema], required: true },
  heartRate: { type: [HeartRateSchema], required: true },
  sleep: { type: [SleepSchema], required: true },
  stepCount: { type: [StepCountSchema], required: true }
});

export default mongoose.model<IWatchData>('Patient_Watch_Data', WatchDataSchema);
