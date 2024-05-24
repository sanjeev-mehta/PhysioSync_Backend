import { Express, Request, Response } from "express";

import { createUser, getUserByEmail } from "../models/Therapist/therapistSignupSchema";
import { authentication, random } from "../helpers/index";


export const therapist_register = async (req: Request, res: Response) => {
    try {
        const { therapist_name, email, password, profile_photo, clinic } = req.body;

        if (!email || !password || !therapist_name || !profile_photo || !clinic || !clinic.name || !clinic.address || !clinic.contact_no) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(409).json({ status: 200, success: true, message: "User Already Exits" });
        }

        const salt = random();
        const user = await createUser({
            therapist_name,
            email,
            profile_photo,
            clinic,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(201).json(user).end(); 

    } catch (error) {
        console.error(error);
        return res.sendStatus(500); 
    }
};


export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        console.log(email, password);

        if(!email || !password){
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if(!user){
            return res.sendStatus(409);
        }

        //autheticate our user without knowing the password

        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password != expectedHash){
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();
        
        res.cookie('physio-sync', user.authentication.sessionToken, {domain: 'localhost', path: '/'})

        return res.status(200).json(user).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}
