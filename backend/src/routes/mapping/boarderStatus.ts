import { Express, Request, Response, Router } from 'express'
import BoarderStatusController from '../../core/controllers/BoarderStatusController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';


const router = Router();


// router.use(jwtAuth("jwt"));
router.get('', BoarderStatusController.getBoarderStatusesFromProject);
router.post('', BoarderStatusController.createBoarderStatus);
router.put('', BoarderStatusController.updateBoarderStatus);
router.delete('/:id', BoarderStatusController.deleteBoarderStatus);


export default router;