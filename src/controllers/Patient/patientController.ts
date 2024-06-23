import { Request, Response } from 'express';
// import admin from '../../config/firebaseAdmin'; 
import Patient from '../../models/Patient/patientModel';
import bcrypt from 'bcryptjs';
import { random, authentication } from '../../helpers/index';
import { has } from 'lodash';
import NotificationReminder from '../../models/Patient/notification';
import mongoose  from 'mongoose';
import Therapist from '../../models/Therapist/therapistSignupSchema';
import messages from 'router/messages/messages';



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
    res.status(201).json({success: true, data: savedPatient});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.params;

    // if (!sessionToken) {
    //   return res.status(409).json({ success: false, message: "Session token not found" });
    // }

    const therapist = await Therapist.findOne({ sessionToken: sessionToken });

    if (!therapist || !therapist._id) {
      return res.status(409).json({ success: false, message: "Therapist not found" });
    }

    const patients = await Patient.find({ therapist_Id: therapist._id, is_active: true }).sort({ created_at: 'desc' });

    return res.status(200).json({ success: true, data: patients });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
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
    res.status(200).json({success: true, data: updatedPatient})
  } catch (error) {
  res.status(500).json({ message: 'Internal server error' });
}
}

export const getPatient = async (req: Request, res: Response) => {
  try {
    const { patient_id } = req.params;
    console.log(patient_id);
    // Query the database to find patients associated with the therapist
    const patient = await Patient.find({ _id: patient_id});

    res.status(200).json({success: true, data: patient});
  } catch (error) {
    res.status(500).json({success: false, message: 'Internal server error' });
  }
};

  export const verifyEmail = async (req:Request, res:Response) => {
    try {
      const {email} = req.params; 
      const getEmail = await Patient.find({ patient_email: email});

      if(!getEmail || getEmail.length === 0){
        res.status(404).json({success: false, message: "Email not found"})
        return
      }
      
      res.status(200).json({success: true, message: "Email found Successful" , data:getEmail});

    } catch (error) {
      res.status(500).json({success: false, message: 'Internal server error' });
    }
  }


  export const setPassword = async (req:Request, res:Response) => {
    try {
      const { password, email } = req.body;
      const getEmail = await Patient.find({ patient_email: email});

      if(!getEmail || getEmail.length === 0){
        res.status(404).json({message: "Email not found"})
      }
     
      const patient = getEmail[0];

      if (patient.password) {
          return res.status(409).json({ status: 409, success: true, message: "Password already set" });
      }

      const salt = random();
      const hashedPassword = authentication(salt, password);
      console.log(hashedPassword)
      const response = await Patient.updateOne({ _id: patient._id }, { password: hashedPassword, salt: salt });

      res.status(200).json({ status: 200, success: true, message: "Password updated successfully" });
      
    } catch (error) {
      res.status(500).json({success: false, message: 'Internal server error' });
    }
  }

  export const patientLogin = async (req:Request, res:Response) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({status: 400, success: false, message: 'Email and password are required.' });
        }

        const user = await Patient.findOne( { patient_email: email} ).select('+salt +password');

        if (!user) {
            return res.status(409).json({status: 409, success: false, message: 'User not found.' });
        }

        const expectedHash = authentication(user.salt, password);

        if(user.password != expectedHash){
            return res.status(403).json({status: 403, success: false, message: "Password is not correct"});
        }

        return res.status(200).json({status: 200, success: true, message: 'Login successful', user }).end();

    } catch (error) {
        console.log('Error during login:', error);
        return res.sendStatus(500).json({ message: 'Internal server error.' });
    }
}
    
export const addNotificationReminder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { patient_id, reminder_time } = req.body;

    const newReminder = new NotificationReminder({
      patient_id: new mongoose.Types.ObjectId(patient_id),
      reminder_time: new Date(reminder_time),
    });

    await newReminder.save();

    return res.status(201).json({ success: true, message: 'Notification reminder added successfully', data: newReminder });
  } catch (error) {
    console.error('Error adding notification reminder:', (error as Error).message);
    return res.status(500).json({ success: false, message: 'Failed to add notification reminder' });
  }
};

export const getNotificationReminders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patientId = req.params.patientId;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    const reminders = await NotificationReminder.find({ patient_id: patientId });

    return res.status(200).json({ success: true, reminders });
  } catch (error) {
    console.error('Error fetching notification reminders:', (error as Error).message);
    return res.status(500).json({ success: false, message: 'Failed to fetch notification reminders' });
  }
};

export const updateNotificationReminder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const patientId = req.params.patientId;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: 'Invalid patient ID' });
    }

    const { reminder_time } = req.body;

    let reminder = await NotificationReminder.findOne({ patient_id: patientId });

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found for the given patient ID' });
    }

    if (reminder_time) {
      reminder.reminder_time = new Date(reminder_time);
    }

    reminder = await reminder.save();

    return res.status(200).json({ success: true, message: 'Notification reminder updated successfully', reminder });
  } catch (error) {
    console.error('Error updating notification reminder:', (error as Error).message);
    return res.status(500).json({ success: false, message: 'Failed to update notification reminder' });
  }
};