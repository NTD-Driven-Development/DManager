import { Express, Request, Response, Router } from 'express'
import UserController from '../../core/controllers/UserController';
import jwtAuth from '../../middlewares/jwtAuth';
import validate from '../../middlewares/validateRequest';
import createUserSchema from '../../core/validations/users/createUserSchema';


const router = Router();


router.use(jwtAuth("jwt"));

// 取得輪值列表
router.get('/duty', UserController.getUserDuties);
// 取得單筆輪值
router.get('/duty/:id', UserController.getUserDutyById);
// 新增輪值
router.post('/duty', UserController.createUserDuty);
// 更新輪值
router.put('/duty', UserController.updateUserDuty);
// 刪除輪值
router.delete('/duty/:id', UserController.deleteUserDuty);
// 取得使用者列表
router.get('', UserController.getUsers);
// 取得單筆使用者
router.get('/:id', UserController.getUserById);
// 新增使用者
router.post('', [validate(createUserSchema)], UserController.createUser);
// 更新使用者
router.put('', UserController.updateUser);
// 刪除使用者
router.delete('/:id', UserController.deleteUser);


export default router;