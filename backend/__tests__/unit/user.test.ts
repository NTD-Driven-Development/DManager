import UserService from "../../src/core/services/UserService"
import UserDao from "../../src/core/daos/UserDao"
import UserRoleDao from "../../src/core/daos/UserRoleDao"
import strings from "../../src/utils/strings"
import RoleEnum from "../../src/enumerates/Role"
import HttpException from "../../src/exceptions/HttpException"

const hashedPwd = "passwordhashed"

const fakeUser = {
    id: 1,
    email: "abc@gmail.com",
    name: "測試",
    sid: "0",
    password: hashedPwd,
    is_admin: false,
    is_actived: true,
    created_at: new Date(),
}

describe("Unit test for UserService.", () => {
    // mocked
    jest.spyOn(UserDao, "create").mockResolvedValue(fakeUser)
    jest.spyOn(strings, "hash").mockReturnValue(hashedPwd)
    jest.spyOn(UserRoleDao, "bulkCreateUserRole").mockResolvedValue(true)

    function givenCreateUserPayload() {
        return {
            email: "abc@gmail.com",
            name: "測試",
            sid: "0",
            roles: [RoleEnum.檢視者],
        }
    }
    
    function givenUpdateUserPayload() {
        return {
            id: 1,
            name: "測試修改",
            is_actived: false,
        }
    }

    async function whenCreateUser(payload: any) {
        return await UserService.createUser(payload)
    }

    it("建立使用者帳號", async () => {
        // given
        const payload = givenCreateUserPayload()

        // when
        const createdResult = await whenCreateUser(payload)

        // then
        expect(createdResult).toBe(true)
        expect(strings.hash).toBeCalledTimes(1)
        expect(UserDao.create).toBeCalledTimes(1)
        expect(UserRoleDao.bulkCreateUserRole).toBeCalledTimes(1)
    })

    // it("given 2 times same data", async () => {
    //     // should be throw
    //     expect(async () => {
    //         await UserService.createUser(givenCreateSuccessData)
    //         await UserService.createUser(givenCreateSuccessData)
    //     }).toThrow(new HttpException("此帳戶已被註冊", 400))
    // })
})
