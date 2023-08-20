import request from "supertest"
import app from "../../src/index"

const mockApp = request(app)
const invalidPayload = {
    name: "test",
    email: "abcgmail.com",
    sid: "S1234567890",
    roles: [1]
}
const successPayload = {
    name: "test",
    email: "abc@gmail.com",
    sid: "S1234567890",
    roles: [1]
}

describe("Acceptance test for UserController.", () => {
    describe("建立使用者", () => {
        it("given valid user data to failure.", async () => {
            const response = await mockApp
                .post("/api/users")
                .send(invalidPayload)
            expect(response.status).toBe(400)
        })

        it("given new user data to create succeeded.", async () => {
            const response = await mockApp
                .post("/api/users")
                .send(successPayload)
            expect(response.status).toBe(200)
        })
        
    })
})
