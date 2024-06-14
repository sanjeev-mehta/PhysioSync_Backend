const mongoose = require('mongoose');

const patientSignUpSchema = new mongoose.Schema({
    therapist_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'therapist', required: true },
    patient_first_name: { type: String, required: true },
    patient_last_name: { type: String, required: true },
    patient_email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    salt: { type: String, required: false, select: false },
    patient_dob: { type: Date, required: true },
    patient_gender: { type: String, required: true },
    patient_medical_history: { type: String, required: false },
    patient_photo: { type: String },
    patient_exercise_reminder_time: { type: [String], required: true },
    patient_created_at: { type: Date, default: Date.now },
    patient_updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSignUpSchema);