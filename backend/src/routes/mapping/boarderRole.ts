import { Express, Request, Response, Router } from 'express'
import BoarderRoleController from '../../core/controllers/BoarderRoleController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';


const router = Router();


router.use(jwtAuth("jwt"));
router.get('', BoarderRoleController.getBoarderRoles);
router.get('/:id', BoarderRoleController.getBoarderRoleById);
router.post('', BoarderRoleController.createBoarderRole);
router.put('', BoarderRoleController.updateBoarderRole);
router.delete('/:id', BoarderRoleController.deleteBoarderRole);


export default router;