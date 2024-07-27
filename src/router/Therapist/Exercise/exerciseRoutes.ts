import  { Router } from 'express';
import { addAssignmentExercise, editAssignmentExercise, getAssignmentExercise, getTherapistNotification, updateCompletedExercise } from '../../../controllers/Therapist/Exercise/exerciseController';
import { isAuthenticated } from '../../../middlewares/index';

export default (router: Router) => {
router.post('/add-assign-exercise',isAuthenticated, addAssignmentExercise);
router.put('/update-assign-exercise/:id', isAuthenticated, editAssignmentExercise);
router.put('/update-completed-status/:id',updateCompletedExercise);
router.get('/get-assign-exercise/:patient_id',  getAssignmentExercise);
router.get('/get-therapist-notification', isAuthenticated, getTherapistNotification);
}