import { Request, Response } from 'express';
// import admin from '../../config/firebaseAdmin'; 
import Patient, { IPatient } from '../../models/Patient/patientModel';
import bcrypt from 'bcryptjs';
import { random, authentication } from '../../helpers/index';

interface PatientData {
  therapist_Id: string;
  first_name: string;
  last_name: string;
  patient_email: string;
  injury_details: string;
  exercise_reminder_time: string;
  medicine_reminder_time: string;
  password: string;
  salt: string;
  date_of_birth: Date;
  allergy_if_any?: string;
  profile_photo?: string;
  gender: string;
  medical_history?: string;
  is_active?: boolean;
}

export const addNewPatient = async (req: Request, res: Response) => {
  try {
    const {
      therapist_Id,
      first_name,
      last_name,
      patient_email,
      injury_details,
      exercise_reminder_time,
      medicine_reminder_time,
      date_of_birth,
      allergy_if_any,
      profile_photo,
      gender,
      medical_history,
      is_active = true
    }: PatientData = req.body;

     const salt = random();

    const newPatient = new Patient({
      therapist_Id,
      first_name,
      last_name,
      patient_email,
      injury_details,
      exercise_reminder_time,
      medicine_reminder_time,
      salt,
      date_of_birth,
      allergy_if_any,
      profile_photo,
      gender,
      medical_history,
      is_active
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

export const disablePatient = async (req: Request, res: Response) => {
  try {
    const patientId: string = req.params.patientId;

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { is_active: false },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
  };

  export const verifyEmail = async (req:Request, res:Response) => {
    try {
      const {email} = req.params; 
      const getEmail = await Patient.find({ patient_email: email});

      if(!getEmail || getEmail.length === 0){
        res.status(404).json({message: "Email not found"})
      }
      
      res.status(200).json({message: "Email found Successful" , data:getEmail});

    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  export const setPassword = async (req:Request, res:Response) => {
    try {
      const {email} = req.params; 
      const getEmail = await Patient.find({ patient_email: email});

      if(!getEmail || getEmail.length === 0){
        res.status(404).json({message: "Email not found"})
      }
     
      const patient = getEmail[0];

      if (patient.password) {
          return res.status(409).json({ message: "Password already set" });
      }

      const { password } = req.body;

      const salt = random();
      const hashedPassword = authentication(salt, password);

      const response = await Patient.updateOne({ _id: patient._id }, { password: hashedPassword });


      res.status(200).json({ message: "Password updated successfully", data: response });
      
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  export const patientLogin = async (req:Request, res:Response) => {
      try {
        const { email, password } = req.body;

        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await Patient.findOne( { patient_email: email} ).select('+.salt +.password');

        if (!user) {
            return res.status(409).json({ message: 'User not found.' });
        }

        const expectedHash = authentication(user.salt, password);

        if(user.password != expectedHash){
            return res.sendStatus(403);
        }

        await user.save();

        return res.status(200).json({ message: 'Login successful', user }).end();

    } catch (error) {
        console.log('Error during login:', error);
        return res.sendStatus(500).json({ message: 'Internal server error.' });
    }
}
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};