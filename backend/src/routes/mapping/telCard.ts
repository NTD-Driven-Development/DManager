import { Express, Request, Response, Router } from 'express'
import TelCardController from '../../core/controllers/TelCardController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';


const router = Router();


router.use(jwtAuth("jwt"));
router.get('/contacter', TelCardController.getTelCardContacters);
router.get('/contacter/:id', TelCardController.getTelCardContacterById);
router.post('/contacter', TelCardController.createTelCardContacter);
router.put('/contacter', TelCardController.updateTelCardContacter);
router.delete('/contacter/:id', TelCardController.deleteTelCardContacter);


export default router;