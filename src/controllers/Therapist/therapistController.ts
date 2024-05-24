import { Express, Request, Response } from "express";  

import {getUserById, getUsers } from "../../models/Therapist/therapistSignupSchema";


export const updateTherapist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      therapist_name,
      email,
      profile_photo,
      clinic,
      authentication
    } = req.body;

    if (!therapist_name || !email || !profile_photo || !clinic || !clinic.name || !clinic.address || !clinic.contact_no) {
      return res.sendStatus(403);
    }

    const user = await getUserById(id);

    user.therapist_name = therapist_name;
    user.email = email;
    user.profile_photo = profile_photo;
    user.clinic.name = clinic.name;
    user.clinic.address = clinic.address;
    user.clinic.contact_no = clinic.contact_no;

    if (authentication) {
      if (authentication.password) user.authentication.password = authentication.password;
      if (authentication.salt) user.authentication.salt = authentication.salt;
      if (authentication.sessionToken) user.authentication.sessionToken = authentication.sessionToken;
    }

    await user.save();

    return res.sendStatus(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

