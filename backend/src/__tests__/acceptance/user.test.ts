import request from "supertest"
import app from "../../app"

const mockApp = request(app)
const mockCreateUser = jest.fn()


jest.mock("../../services/userService", () => {
    return jest.fn().mockImplementation(() => {
        return {createUser: mockCreateUser}
    })
})

describe("Acceptance test for user creation", () => {


})