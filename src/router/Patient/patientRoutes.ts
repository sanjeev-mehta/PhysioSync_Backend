import { Router } from 'express';
import { addNewPatient,getAllPatients,updatePatient, disablePatient, getPatient, verifyEmail, setPassword, patientLogin,addNotificationReminder,getNotificationReminders, updateNotificationReminder } from '../../controllers/Patient/patientController';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/add_new_patients', isAuthenticated, addNewPatient);
    router.get('/get_all_patients', isAuthenticated, getAllPatients); 
    router.put('/update_patients/:patientId', isAuthenticated, updatePatient); 
    router.put('/update_patient/:patientId', updatePatient); // patient updation
    router.get('/patient_email/:email', verifyEmail);
    router.put('/disable_patient/:patientId', isAuthenticated, disablePatient);
    router.get('/get_patient/:patient_id', getPatient);
    router.post('/set_password', setPassword);
    router.post('/patient_login', patientLogin);
    router.post('/new_Notification_time', addNotificationReminder);
    router.get('/get_notification_time/:patientId', getNotificationReminders);
    router.put('/update_notification_time/:patientId', updateNotificationReminder);
};


