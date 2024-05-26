import  { Router } from 'express';
import { addTherapist } from '../../controllers/Therapist/therapistController';
import { login } from '../../controllers/Therapist/loginController';

export default (router: Router) => {
    router.post('/auth/therapist_register', addTherapist);
    router.post('/auth/login', login);
}