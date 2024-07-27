import  { Router } from 'express';
import { addTherapist, editTherapistController, getTherapistController, updateTherapistPassword, updatePatientPassword, removeTherapist} from '../../controllers/Therapist/therapistController';
import { login } from '../../controllers/Therapist/loginController';
import { isAuthenticated, isOwner, logout } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/auth/therapist_register', addTherapist);  // verified working fine
    router.post('/auth/therapist_login', login);
    router.put('/update-therapists',  isAuthenticated,  editTherapistController);
    router.get('/get-therapist', isAuthenticated, getTherapistController);
    router.post('/logout', logout);
    router.put('/update-password', isAuthenticated, updateTherapistPassword );
    router.put('/update-patient-password/:patient_id', updatePatientPassword );
    router.delete('/delete-therapist', isAuthenticated, removeTherapist);
}