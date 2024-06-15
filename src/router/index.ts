import express, { Router } from 'express';
import therapistroutes from './Therapist/therapistRoutes';
import assignExerciseRoutes from './Therapist/Exercise/exerciseRoutes'
import patientRoutes from './Patient/patientRoutes';


const router: Router = express.Router();

export default (): Router => {
    therapistroutes(router);
    assignExerciseRoutes(router);
    assignExerciseRoutes(router);
    patientRoutes(router)
    return router;
}