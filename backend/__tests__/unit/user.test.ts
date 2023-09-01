import UserService from "../../src/core/services/UserService"
import UserDao from "../../src/core/daos/UserDao"
import UserRoleDao from "../../src/core/daos/UserRoleDao"
import strings from "../../src/utils/strings"
import RoleEnum from "../../src/enumerates/Role"
import { UniqueConstraintError } from "sequelize"

describe("Unit test for UserService.", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
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
    } as any
    function givenCreateUserPayload() {
        return {
            email: "abc@gmail.com",
            name: "測試",
            sid: "0",
            roles: [RoleEnum.檢視者],
        }
    }

    async function whenCreateUser(payload: any) {
        jest.spyOn(UserDao, "create").mockResolvedValue(fakeUser)
        jest.spyOn(strings, "hash").mockReturnValue(hashedPwd)
        jest.spyOn(UserRoleDao, "bulkCreateUserRole").mockResolvedValue(
            true as any
        )
        return await UserService.createUser(payload, fakeUser)
    }

    async function whenCreateSameEmailUser(payload: any) {
        jest.spyOn(UserDao, "create").mockRejectedValue(
            new UniqueConstraintError({})
        )
        return await UserService.createUser(payload, fakeUser)
    }

    function givenUpdateUserPayload() {
        return {
            id: 1,
            name: "測試修改",
            is_actived: false,
        }
    }

    describe("建立使用者帳號", () => {
        it("應能正常建立使用者且擁有權限", async () => {
            // given
            const payload = givenCreateUserPayload()

            // when
            const createdResult = await whenCreateUser(payload)

            // then
            expect(createdResult).toBe(fakeUser)
            expect(strings.hash).toBeCalledTimes(1)
            expect(UserDao.create).toBeCalledTimes(1)
            expect(UserRoleDao.bulkCreateUserRole).toBeCalledTimes(1)
        })

        it("重複註冊相同 Email 應拋出「此 Email 已被註冊」，設定狀態碼 400。", async () => {
            // given
            const errorMessage: string = "此 Email 已被註冊"
            const payload = givenCreateUserPayload()

            // when
            const result = whenCreateSameEmailUser(payload)

            // then
            await expect(result).rejects.toThrow(errorMessage)
            await expect(result).rejects.toHaveProperty("statusCode", 400)
        })
    })
})
