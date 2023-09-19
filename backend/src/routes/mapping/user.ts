import { Express, Request, Response, Router } from "express"
import UserController from "../../core/controllers/UserController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"
import createUserSchema from "../../core/validations/users/createUserSchema"

const router = Router()

router
    .use(jwtAuth("jwt"))
    // 取得輪值列表
    .get("/duty", UserController.getUserDuties)
    // 取得單筆輪值
    .get("/duty/:id", UserController.getUserDutyById)
    // 新增輪值
    .post("/duty", UserController.createUserDuty)
    // 更新輪值
    .put("/duty", UserController.updateUserDuty)
    // 刪除輪值
    .delete("/duty/:id", UserController.deleteUserDuty)
    // 取得使用者列表
    .get("", UserController.getUsers)
    // 取得單筆使用者
    .get("/:id", UserController.getUserById)
    // 新增使用者
    .post("", [validate(createUserSchema)], UserController.createUser)
    // 更新使用者
    .put("", UserController.updateUser)
    // 刪除使用者
    .delete("/:id", UserController.deleteUser)

export default router
