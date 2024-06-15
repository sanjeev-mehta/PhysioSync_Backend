import { Router } from 'express';
// import { addNewPatient,getAllPatients,updatePatient, verifyEmail } from '../../controllers/Patient/patientController';
import { addNewPatient,getAllPatients,updatePatient, disablePatient, verifyEmail } from '../../controllers/Patient/patientController';


export default (router: Router) => {
    router.post('/add_new_patients', addNewPatient);
    router.get('/get_all_patients/:therapistId', getAllPatients); // Route to get all patients related to a therapist
    router.put('/update_patients/:patientId', updatePatient); // New route to update patient information
    router.get('/:email', verifyEmail);
    router.put('/disable_patient/:patientId', disablePatient);
};

// router.post('/add_new_patients', addNewPatient);
// router.get('/get_all_patients/:therapistId', getAllPatients); // Route to get all patients related to a therapist
// router.put('/update_patients/:patientId', updatePatient); // route to update patient information
// router.put('/disable_patient/:patientId', disablePatient); // route to disable patient


