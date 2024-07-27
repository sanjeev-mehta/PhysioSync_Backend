require('dotenv').config();
import { Request, Response } from 'express';
import admin from '../../config/firebaseAdmin'; 
import Therapist from '../../models/Therapist/therapistSignupSchema';
import { random, authentication } from '../../helpers/index';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({sucess:true, message: 'Email and password are required.' });
        }

        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch (firebaseError) {

            console.error('Firebase error:', firebaseError);
            if (firebaseError.code === 'auth/user-not-found') {
                return res.status(409).json({sucess:true, message: 'User not found.' });
            }
            throw firebaseError;
        }

        const uid = userRecord.uid;

        if (!userRecord.emailVerified) {
            return res.status(403).json({ success:true, message: 'Email is not verified.' });
        }

        const user = await Therapist.findOne({ firebase_uid: uid }).select('+authentication.salt +authentication.password +is_active');


        const Token = {
            Access_Key: process.env.Access_Key,
            Secret_access_key: process.env.Secret_access_key
        }

        if (!user) {
            return res.status(409).json({ message: 'User not found.' });
        }
        if (!user.is_active) {
            return res.status(404).json({ message: 'User not found with these credentials. Please create an account.' });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password != expectedHash){
            return res.status(403).json({success:true, message: 'Password does not match'});
        }

        const sessionSalt = random();
        user.authentication.sessionToken = authentication(sessionSalt, user._id.toString());

        if(user.is_authenticated == true){
            return
        }else{
            user.is_authenticated = true;
        }
        await user.save();

        res.cookie('physio-sync', user.authentication.sessionToken, { domain: 'localhost', path: '/', httpOnly: true });

        return res.status(200).json({ message: 'Login successful', data: user, token: Token }).end();

    } catch (error) {
        console.log('Error during login:', error);
        return res.sendStatus(500).json({ message: 'Internal server error.' });
    }
};
