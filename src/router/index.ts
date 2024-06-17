import express, { Router } from 'express';
import therapistroutes from './Therapist/therapistRoutes';
import assignExerciseRoutes from './Therapist/Exercise/exerciseRoutes'
import patientRoutes from './Patient/patientRoutes';
import exercise_category_routes from './exercise/exercise_category_routes';
import exercises_routes from './exercise/exercises_routes';
import messages from './messages/messages';

const router: Router = express.Router();

export default (): Router => {
    therapistroutes(router);
    assignExerciseRoutes(router);
    assignExerciseRoutes(router);
    patientRoutes(router)
    exercise_category_routes(router)
    exercises_routes (router)
    messages(router)
    return router;
}