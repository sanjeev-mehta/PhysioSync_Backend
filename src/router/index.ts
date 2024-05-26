import express, { Router } from 'express';
import therapistCustroller from './Therapist/therapistRoutes';


const router: Router = express.Router();

export default (): Router => {
    therapistCustroller(router);
    return router;
}