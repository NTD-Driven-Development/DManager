import { Request, Response, NextFunction } from "express"
import { AnySchema } from "yup"
import ValidationException from "../exceptions/ValidationException"

export default (schema: AnySchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let { body, query, params } = await schema.validate(req)
            // 將 query 所有參數都轉成字串
            Object.keys(query).forEach((key) => {
                query[key] = String(query[key])
            })
            req.body = body
            req.query = query
            req.params = params
            return next()
        } catch (error: any) {
            const err =  new ValidationException(error.message)
            next(err)
        }
    }
