import { Request, Response } from 'express';
import admin from '../../config/firebaseAdmin'; 
import Therapist from '../../models/Therapist/therapistSignupSchema';
import { random, authentication } from '../../helpers/index';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch (firebaseError) {

            console.error('Firebase error:', firebaseError);
            if (firebaseError.code === 'auth/user-not-found') {
                return res.status(409).json({ message: 'User not found.' });
            }
            throw firebaseError;
        }

        const uid = userRecord.uid;

        // if (!userRecord.emailVerified) {
        //     return res.status(403).json({ message: 'Email is not verified.' });
        // }

        const user = await Therapist.findOne({ firebase_uid: uid }).select('+authentication.salt +authentication.password');

        const Token = {
            Access_Key: process.env.Access_Key,
            Secret_access_key: process.env.Secret_access_key
        }

        if (!user) {
            return res.status(409).json({ message: 'User not found.' });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password != expectedHash){
            return res.sendStatus(403);
        }

        const sessionSalt = random();
        user.authentication.sessionToken = authentication(sessionSalt, user._id.toString());

        await user.save();

        res.cookie('physio-sync', user.authentication.sessionToken, { domain: 'localhost', path: '/', httpOnly: true });

        return res.status(200).json({ message: 'Login successful', data: user, token: Token }).end();

    } catch (error) {
        console.log('Error during login:', error);
        return res.sendStatus(500).json({ message: 'Internal server error.' });
    }
};
