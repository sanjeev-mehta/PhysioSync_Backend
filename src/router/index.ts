import express, { Router } from 'express';
import therapistroutes from './Therapist/therapistRoutes';
import assignExerciseRoutes from './Therapist/Exercise/exerciseRoutes'


const router: Router = express.Router();

export default (): Router => {
    therapistroutes(router);
    assignExerciseRoutes(router);
    return router;
}