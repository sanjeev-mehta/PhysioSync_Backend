import mongoose, { Document, Schema } from 'mongoose';

interface Clinic {
  name: string;
  address: string;
  contact_no: string;
}

interface Authentication {
  salt: string;
  password: string;
  sessionToken?: string;
}

interface ITherapist extends Document {
  therapist_name: string;
  email: string;
  profile_photo: string;
  clinic: Clinic;
  firebase_uid: string;
  authentication: Authentication;
  is_authenticated: boolean;
}

const clinicSchema = new Schema<Clinic>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact_no: { type: String, required: true },
});

const authenticationSchema = new Schema<Authentication>({
  salt: { type: String, required: true, select: false },
  password: { type: String, required: true, select: false },
  sessionToken: { type: String, required: false, select: false },
});

const therapistSignupSchema: Schema<ITherapist> = new Schema({
  therapist_name: { type: String, required: true },
  email: { type: String, required: true },
  profile_photo: { type: String, required: true },
  clinic: { type: clinicSchema, required: true },
  firebase_uid: { type: String, required: true },
  authentication: { type: authenticationSchema, required: true },
  is_authenticated: { type: Boolean, default: false },
});

const Therapist = mongoose.model<ITherapist>('Therapist', therapistSignupSchema);

export default Therapist;
export type { ITherapist };
