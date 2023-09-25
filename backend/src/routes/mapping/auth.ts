import { Express, Request, Response, Router } from "express"
import AuthController from "../../core/controllers/AuthController"
import jwtAuth from "../../middlewares/jwtAuth"
import validate from "../../middlewares/validateRequest"
import loginSchema from "../../core/validations/auth/loginSchema"

const router = Router()

// 登入
router.post(
    "/login",
    [validate(loginSchema), jwtAuth("local")],
    AuthController.login
)
// 刷新 Token
router.post("/refresh", AuthController.refreshToken)
// 忘記密碼
router.post("/forget", AuthController.forgetPassword)
// 忘記密碼驗證
router.post("/verifyForget", AuthController.verifyForgetPasswordToken)
// 重設密碼
router.patch("/resetPassword", AuthController.resetPassword)

// router.use()
router
    .use(jwtAuth("jwt"))
    // 檢查 Token 是否有效
    .get("/check", AuthController.healthCheck)
    // 登出
    .post("/logout", AuthController.logout)
    // 修改密碼
    .patch("/changePassword", AuthController.changePassword)

export default router
