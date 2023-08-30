import request from "supertest"
import app from "../src/index"
import { Request } from "express"
import RequestUser from "../src/core/exportDtos/auth/RequestUser"

global.console = require("console")
jest.spyOn(console, "log").mockImplementation(() => {})

//mocked Request user attribute
export const mockUser = {
    id: 1,
    name: "E2eTest",
    is_admin: true,
} as RequestUser

export const App = request(app)

jest.mock(
    "../src/middlewares/jwtAuth",
    () => {
        return (type: any) => (_: Request, __: any, next: any): any => {
            _.user = mockUser
            next()
        }
    }
)
