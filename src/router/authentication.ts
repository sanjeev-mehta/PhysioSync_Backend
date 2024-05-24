import { Router} from 'express';
import {login, therapist_register} from '../controllers/authentication';

export default (router: Router) => {
    router.post('/auth/therapist_register', therapist_register);
    router.post('/auth/login', login);
}