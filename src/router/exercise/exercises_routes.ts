import  { Router } from 'express';
import { createExercise, getAllExercise, updateExercise,delete_exercise } from '../../controllers/exercise/exercises_controller';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {

router.post('/add_new_exercise',isAuthenticated, createExercise);
router.get('/get_all_exercises', isAuthenticated ,getAllExercise);
router.put('/updateExercise/:exerciseId', isAuthenticated, updateExercise);
router.delete('/delete_exercise/:exerciseId', isAuthenticated, delete_exercise);

}