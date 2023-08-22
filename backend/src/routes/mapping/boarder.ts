import { Express, Request, Response, Router } from 'express'
import BoarderController from '../../core/controllers/BoarderController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';


const router = Router();


// router.use(jwtAuth("jwt"));
router.get('', BoarderController.getBoardersFromProject);


export default router;