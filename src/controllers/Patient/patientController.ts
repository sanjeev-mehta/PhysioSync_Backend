import { Request, Response } from 'express';
import admin from '../../config/firebaseAdmin'; // Make sure you have firebase admin setup
import Patient, { IPatient } from '../../models/Patient/patientModel';
import bcrypt from 'bcryptjs';

interface PatientData {
  therapist_Id: string;
  first_name: string;
  last_name: string;
  patient_email: string;
  injury_details: string;
  password: string;
  exercise_reminder_time: string;
  medicine_reminder_time: string;
  date_of_birth: Date;
  allergy_if_any?: string;
  profile_photo?: string;
  gender: string;
  medical_history?: string;
}

export const addNewPatient = async (req: Request, res: Response) => {
  try {
    const {
      therapist_Id,
      first_name,
      last_name,
      patient_email,
      injury_details,
      password,
      exercise_reminder_time,
      medicine_reminder_time,
      date_of_birth,
      allergy_if_any,
      profile_photo,
      gender,
      medical_history
    }: PatientData = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newPatient = new Patient({
      therapist_Id,
      first_name,
      last_name,
      patient_email,
      injury_details,
      password: hashedPassword,
      exercise_reminder_time,
      medicine_reminder_time,
      date_of_birth,
      allergy_if_any,
      profile_photo,
      gender,
      medical_history
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getAllPatients = async (req: Request, res: Response) => {
    try {
      const therapistId: string = req.params.therapistId;
  
      // Query the database to find patients associated with the therapist
      const patients = await Patient.find({ therapist_Id: therapistId });
  
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  export const updatePatient = async (req: Request, res: Response) => {
    try {
      const patientId: string = req.params.patientId; 
      const updatedData = req.body; // Data to be updated
  
      // Find the patient by ID and update their information
      const updatedPatient = await Patient.findByIdAndUpdate(patientId, updatedData, { new: true });
  
      if (!updatedPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json(updatedPatient);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };