import express from 'express';
import { createExerciseCategory } from '../../controllers/exercise/exercise_category_controller';
import { getAllExerciseCategories } from '../../controllers/exercise/exercise_category_controller'; // Make sure to create this file


const router = express.Router();

router.post('/exercise-categories', createExerciseCategory);
router.get('/getAllcategories', getAllExerciseCategories); // New route to get all categories


export default router;
