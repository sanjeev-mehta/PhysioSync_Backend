import  { Router } from 'express';
import { addAssignmentExercise, editAssignmentExercise, getAssignmentExercise, getTherapistNotification } from '../../../controllers/Therapist/Exercise/exerciseController';
import { isAuthenticated } from '../../../middlewares/index';

export default (router: Router) => {
router.post('/add-assign-exercise', addAssignmentExercise);
router.put('/update-assign-exercise/:id', isAuthenticated, editAssignmentExercise);
router.get('/get-assign-exercise/:patient_id',  getAssignmentExercise);
router.get('/get-therapist-notification', isAuthenticated, getTherapistNotification);
}