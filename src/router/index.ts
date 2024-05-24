import express, { Router } from 'express';
import authentication from './authentication';
import users from './Therapist/therapistRoutes';

const router: Router = express.Router();

export default (): Router => {
    authentication(router);
    users(router)
    return router;
}