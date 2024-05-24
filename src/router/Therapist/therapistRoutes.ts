import { Router} from 'express';

import { updateTherapist} from '../../controllers/Therapist/therapistController';
import { isAuthenticated, isOwner } from '../../middlewares/index';


export default (router: Router) => {
    router.patch('/therapist/:id', isAuthenticated, isOwner, updateTherapist)
}


