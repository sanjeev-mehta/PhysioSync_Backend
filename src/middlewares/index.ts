import {Express, Request, Response} from 'express';
import {get, identity, merge} from 'lodash';

import { getUserBySessionToken } from '../models/Therapist/therapistSignupSchema';

export const isOwner = async (req: Request, res: Response, next: () => void) => {
    try{
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.sendStatus(403);
        }

        if(currentUserId.toString() != id){
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