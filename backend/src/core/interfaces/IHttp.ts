import { Request, Response } from "express"
import RequestUser from "../exportDtos/auth/RequestUser"

export interface IResponse extends Response {
    logMessage?: string
}

export interface IRequest extends Request {
    user?: RequestUser | Express.User
    routeUrl?: string
}
