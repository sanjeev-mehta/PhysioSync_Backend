import { Express, Request, Response } from "express";
import {createTherapist, editTherapist, getSingleTherapist, updatePassword, updatepatientPassword} from "../../models/Therapist/therapistModel";

export const addTherapist = async (req: Request, res: Response) => {
  try {
    const {
      therapist_name,
      email,
      profile_photo,
      clinic_name,
      clinic_address,
      clinic_contact_no,
      password
    } = req.body;

    console.log('Received data for creating therapist:', req.body);

    const result = await createTherapist({
      therapist_name,
      email,
      profile_photo,
      clinic_name,
      clinic_address,
      clinic_contact_no,
      password
    });

    if (result && result.success) {
      res.status(201).json({ status: 201, success: true, message: result.message, data: result.data});
    } else {
      res.status(400).json({ status: 400, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in addTherapist controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};

export const editTherapistController = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.params;
    const newData = req.body;

    console.log('Received data for editing therapist:', newData);

    const result = await editTherapist(sessionToken, newData);

    if (result && result.success) {
      res.status(200).json({ status: 200, success: true, message: result.message, data: result.data });
    } else {
      res.status(404).json({ status: 404, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in editTherapist controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};

export const getTherapistController = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.params;
  
    const result = await getSingleTherapist(sessionToken);

    if (result && result.success) {
      res.status(200).json({ status: 200, success: true, message: result.message, data: result.data });
    } else {
      res.status(404).json({ status: 404, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in editTherapist controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};


export const updateTherapistPassword = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.params;
    const { oldPassword, newPassword } = req.body;


    console.log('Received data for editing therapist:', { oldPassword, newPassword });

    const result = await updatePassword(sessionToken,  oldPassword, newPassword);

    if (result && result.success) {
      res.status(200).json({ status: 200, success: true, message: result.message, data: result.data });
    } else {
      res.status(404).json({ status: 404, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in editTherapist controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};

export const updatePatientPassword = async (req: Request, res: Response) => {
  try {
    const { patient_id } = req.params;
    const { oldPassword, newPassword } = req.body;


    console.log('Received data for editing therapist:', { oldPassword, newPassword });

    const result = await updatepatientPassword(patient_id,  oldPassword, newPassword);

    if (result && result.success) {
      res.status(200).json({ status: 200, success: true, message: result.message, data: result.data });
    } else {
      res.status(404).json({ status: 404, success: false, error: result.message });
    }
  } catch (error: any) {
    console.error('Error in editTherapist controller:', error.message);
    res.status(500).json({ status: 500, success: false, error: 'Internal Server Error' });
  }
};
