import { NextFunction } from "express"
import { AnySchema } from "yup"
import ValidationException from "../exceptions/ValidationException"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import route from "../utils/route"

export default (schema: AnySchema) =>
    async (req: IRequest, res: IResponse, next: NextFunction) => {
        try {
            req.routeUrl = route.getApiRouteFullPathFromRequest(req)
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
            next(new ValidationException(error.message))
        }
    }
