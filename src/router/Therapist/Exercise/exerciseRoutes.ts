import  { Router } from 'express';
import { addAssignmentExercise, editAssignmentExercise, getAssignmentExercise } from '../../../controllers/Therapist/Exercise/exerciseController';

export default (router: Router) => {
router.post('/add-assign-exercise', addAssignmentExercise);
router.put('/update-assign-exercise/:id', editAssignmentExercise);
router.get('/get-assign-exercise/:id', getAssignmentExercise);
}