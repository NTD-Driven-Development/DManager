import { NextFunction } from "express"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import HttpException from "../exceptions/HttpException"
import HttpResponse from "../utils/httpResponse"
import ValidationException from "../exceptions/ValidationException"

export default (
    err: HttpException | ValidationException | Error,
    req: IRequest,
    res: IResponse,
    next: NextFunction
) => {
    res.customMessage = err?.message
    if (err instanceof HttpException) {
        const response: HttpResponse = HttpResponse.failure(
            err.message,
            err.statusCode
        )
        return res.status(response.statusCode).json(response)
    }
    if (err instanceof ValidationException) {
        const response: HttpResponse = HttpResponse.failure(
            err.message,
            err.statusCode
        )
        return res.status(response.statusCode).json(response)
    }
    if (err instanceof Error) {
        const response: HttpResponse = HttpResponse.failure(err.message)
        return res.status(response.statusCode).json(response)
    }

    return next()
}
