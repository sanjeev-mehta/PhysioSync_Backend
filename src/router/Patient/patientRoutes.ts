import { Router } from 'express';
import { addNewPatient,getAllPatients,updatePatient, disablePatient, getPatient, verifyEmail, setPassword, patientLogin } from '../../controllers/Patient/patientController';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/add_new_patients', isAuthenticated, addNewPatient);
    router.get('/get_all_patients', isAuthenticated, getAllPatients); 
    router.put('/update_patients/:patientId', isAuthenticated, updatePatient); 
    router.get('/patient_email/:email', verifyEmail);
    router.put('/disable_patient/:patientId', isAuthenticated, disablePatient);
    router.get('/get_patient/:patient_id', isAuthenticated, getPatient);
    router.post('/set_password', setPassword);
    router.post('/patient_login', patientLogin);
};


