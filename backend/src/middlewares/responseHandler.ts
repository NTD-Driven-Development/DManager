import { NextFunction } from "express"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import HttpResponse from "../utils/httpResponse"

export default (
    handle: HttpResponse | any,
    req: IRequest,
    res: IResponse,
    next: NextFunction
) => {
    if (handle instanceof HttpResponse) {
        return res.status(handle.statusCode).json(handle)
    }
    return next(handle)
}
