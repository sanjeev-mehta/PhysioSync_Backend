import  { Router } from 'express';
import { addTherapist, editTherapistController, getTherapistController } from '../../controllers/Therapist/therapistController';
import { login } from '../../controllers/Therapist/loginController';
import { isAuthenticated, isOwner, logout } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/auth/therapist_register', addTherapist);
    router.post('/auth/therapist_login', login);
    router.put('/update-therapists/:sessiontoken',  isAuthenticated,  editTherapistController);
    router.get('/get-therapist/:sessiontoken', getTherapistController);
    router.post('/logout', logout);
}