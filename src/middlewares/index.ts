import {Express, Request, Response} from 'express';
import {get, identity, merge} from 'lodash';
import Therapist from '../models/Therapist/therapistSignupSchema';

export const getUserBySessionToken = (sessionToken: String) => Therapist.findOne({'authentication.sessionToken': sessionToken})

export const isOwner = async (req: Request, res: Response, next: () => void) => {
    try{
        const {sessionToken} = req.params;
        const currentUserId = req.cookies['physio-sync'];
        
        if(!currentUserId){
            return res.sendStatus(403);
        }

        if(currentUserId.toString() != sessionToken){
            return res.sendStatus(403);
        }

        next();

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}


export const isAuthenticated = async (req: Request, res: Response, next: () => void) => {
    try{
        const sessionToken = req.cookies['physio-sync'];

        if(!sessionToken){
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
          return res.sendStatus(403);
        }

        merge(req, {identity: existingUser});

        return next();
        
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        if (!req.cookies['physio-sync']) {
            return res.status(409).json({ status: 409, success: false, message: "Login First" });
        }
        res.clearCookie('physio-sync');
        return res.status(200).json({ status: 200, success: true, message: "Logout Successful" });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
