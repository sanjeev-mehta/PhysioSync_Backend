import  { Router } from 'express';
import { createExerciseCategory, getAllExerciseCategories } from '../../controllers/exercise/exercise_category_controller';
import { isAuthenticated } from '../../middlewares/index';

export default (router: Router) => {
    router.post('/exercise-categories', createExerciseCategory);
    router.get('/getAllcategories', isAuthenticated, getAllExerciseCategories); // New route to get all categories
}