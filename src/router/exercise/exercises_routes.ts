import express from 'express';
import { createExercise, getAllExercise } from '../../controllers/exercise/exercises_controller';
  
const router = express.Router();


router.post('/add_new_exercise', createExercise);
router.get('/get_all_exercises',getAllExercise);

export default router;
