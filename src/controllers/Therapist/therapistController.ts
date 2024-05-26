import { Express, Request, Response } from "express";
import createTherapist from "../../models/Therapist/therapistModel";

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

