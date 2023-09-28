import request from "supertest"
import app from "../src/index"
import { NextFunction } from "express"
import { IRequest, IResponse } from "../src/core/interfaces/IHttp"
import RequestUser from "../src/core/exportDtos/auth/RequestUser"

global.console = require("console")
// jest.spyOn(console, "log").mockImplementation(() => {})

//mocked Request user attribute
export const mockUser = {
    id: 1,
    email: "forTest123@gmail.com",
    name: "E2eTest",
    is_admin: true,
    is_actived: true,
    roles: [] as any,
    permissions: [] as any,
} as RequestUser

export const mockBeforeLoginHeader = {
    "Content-Type": "application/json",
    "User-Agent": "jest",
}

export const mockAfterLoginHeader = {
    "Content-Type": "application/json",
    "User-Agent": "jest",
    Authorization: "Bearer " + process.env.TEST_ACCESS_TOKEN,
}

export const App = request(app)

jest.mock("../src/middlewares/jwtAuth", () => {
    return (type: any) =>
        (req: IRequest, res: IResponse, next: NextFunction): any => {
            req.user = mockUser
            next()
        }
})

jest.mock("../src/middlewares/sysLog", () => {
    return (req: IRequest, res: IResponse, next: NextFunction): any => {
        next()
    }
})

jest.mock("../src/middlewares/sysErrorLog", () => {
    return (req: IRequest, res: IResponse, next: NextFunction): any => {
        next()
    }
})
