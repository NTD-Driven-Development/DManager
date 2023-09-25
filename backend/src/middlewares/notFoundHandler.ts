import { NextFunction } from "express"
import { IRequest, IResponse } from "../core/interfaces/IHttp"
import HttpException from "../exceptions/HttpException"

export default (req: IRequest, res: IResponse, next: NextFunction) => {
    const err = new HttpException("Not Found", 404)
    return next(err)
}
