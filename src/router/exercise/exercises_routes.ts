import express from 'express';
import { createExercise, getAllExercise, updateExercise,delete_exercise } from '../../controllers/exercise/exercises_controller';
  
const router = express.Router();


router.post('/add_new_exercise', createExercise);
router.get('/get_all_exercises',getAllExercise);
router.put('/updateExercise/:exerciseId', updateExercise);
router.delete('/delete_exercise/:exerciseId',delete_exercise);


export default router;
