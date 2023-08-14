import { Express, Request, Response, Router } from 'express'
import UserController from '../../core/controllers/UserController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';
import createUserSchema from '../../core/validations/users/createUserSchema';


const router = Router();


// router.use(jwtAuth("jwt"));
// router.get('', UserController.getAllUsersData);
// router.get('/:id', UserController.getUserDataById);
router.post('', [validate(createUserSchema)], UserController.createUser);
// router.put('', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);

export default router;