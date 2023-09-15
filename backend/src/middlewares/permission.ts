import { Request, Response, NextFunction } from "express"
import HttpException from "../exceptions/HttpException"


// const permission = (req: Request, res: Response, next) => {
//     const { user } = req
//     const { permission } = req.route.meta
//     if (permission && !user.permissions.includes(permission)) {
//         return next(new HttpException("權限不足", 403))
//     }
//     return next()
// }