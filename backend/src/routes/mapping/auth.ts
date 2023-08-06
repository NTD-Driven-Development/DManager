import { Express, Request, Response, Router } from 'express'
import AuthController from '../../core/controllers/AuthController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';
import loginSchema from '../../core/validations/auth/loginSchema';


const router = Router();

router.post('/login', [validate(loginSchema), jwtAuth("local")], AuthController.login);
router.post('/refresh', AuthController.refreshToken);

router.use(jwtAuth("jwt"));
router.post('/logout', [], AuthController.logout);
export default router;