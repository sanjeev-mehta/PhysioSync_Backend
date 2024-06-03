import { Router } from 'express';
import { addNewPatient,getAllPatients,updatePatient } from '../../controllers/Patient/patientController';

const router = Router();

router.post('/add_new_patients', addNewPatient);
router.get('/get_all_patients/:therapistId', getAllPatients); // Route to get all patients related to a therapist
router.put('/update_patients/:patientId', updatePatient); // New route to update patient information


export default router;