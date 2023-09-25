import { Transaction } from "sequelize"
import { App, mockUser } from "../../config/preE2eConfig"
import Db from "../../src/models"
import _ from "lodash"
import ProjectDao from "../../src/core/daos/ProjectDao"
import PointRuleDao from "../../src/core/daos/PointRuleDao"
import BoarderRoleDao from "../../src/core/daos/BoarderRoleDao"
import BoarderDao from "../../src/core/daos/BoarderDao"
import UserDao from "../../src/core/daos/UserDao"

describe("Acceptance test for ShareController.", () => {
    function givenCreateProjectPayload(concatStr: string) {
        return {
            name: `ATDD_share${concatStr}`,
        }
    }

    it("取得樓區室床清單", async () => {
        const response = await App.get("/api/share/bunks")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得班級清單", async () => {
        const response = await App.get("/api/share/classes")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("取得住宿生狀態清單", async () => {
        const response = await App.get("/api/share/boarderStatuses")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("建立一個項目，該項目會在「取得項目清單」內", async () => {
        // given
        const testProject = await ProjectDao.create(
            givenCreateProjectPayload("1")
        )
        const id = testProject?.id
        // when
        const response = await App.get("/api/share/projects")
        // then
        const data = response.body?.data
        expect(response.status).toBe(200)
        expect(data?.length ?? 0).toBeGreaterThan(0)
        expect(_.find(data, (item) => item.id == id)).toBeDefined()
    })

    it("建立一個項目，該項目建立一個住宿生身分，該身份會在「取得住宿生身分別清單」內", async () => {
        // given
        const testProject = await ProjectDao.create(
            givenCreateProjectPayload("2")
        )
        await BoarderRoleDao.create({
            project_id: testProject.id as number,
            name: "ATDD_share",
        })
        const payload = {
            project_id: testProject.id,
        }
        // when
        const response = await App.get("/api/share/boarderRoles").query(payload)
        // then
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBe(1)
    })

    it("取得電話卡聯絡人清單", async () => {
        const response = await App.get("/api/share/telCards/contacter")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("建立一筆加扣點規則，該筆規則會在「取得加扣點規則清單」內", async () => {
        // given
        const testPointRule = await PointRuleDao.create({
            code: "ATDD_share",
            reason: "ATDD_share",
            point: 1,
        })
        // when
        const response = await App.get("/api/share/points/rule")
        // then
        const testData = _.find(response.body?.data, (item) => item.id == testPointRule.id )
        expect(response.status).toBe(200)
        expect(testData).toBeTruthy()
    })

    it("建立一筆項目、一筆住宿生紀錄，已建立的住宿生會在「該項目的住宿生列表」內，包含學號、門禁卡號、姓名、床位和班級", async () => {
        // given
        const testProject = await ProjectDao.create(
            givenCreateProjectPayload("3")
        )
        await BoarderDao.create({
            id: "ATDD_share",
            project_id: testProject.id as number,
            name: "ATDD_share",
            boarder_status_id: 1,
        })
        const payload = {
            project_id: testProject.id,
        }
        // when
        const response = await App.get("/api/share/boarders").query(payload)
        // then
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBe(1)
        _.forEach(response.body?.data, (item) => {
            expect(item).toHaveProperty("id")
            expect(item).toHaveProperty("sid")
            expect(item).toHaveProperty("access_card")
            expect(item).toHaveProperty("name")
            expect(item).toHaveProperty("project_bunk")
            expect(item).toHaveProperty("class")
        })
    })

    it("取得角色清單", async () => {
        const response = await App.get("/api/share/roles")
        expect(response.status).toBe(200)
        expect(response.body?.data?.length ?? 0).toBeGreaterThan(0)
    })

    it("建立一筆使用者，已建立的使用者會在「取得使用者清單」內", async () => {
        // given
        const testUser = await UserDao.create({
            email: "ATDD_share@gmail.com",
            password: "ATDD_share",
            name: "ATDD_share",
        })
        // when
        const response = await App.get("/api/share/users")
        // then
        const data = response.body?.data
        const user = _.find(data, (item) => item?.id == testUser.id)
        expect(response.status).toBe(200)
        expect(user).toBeTruthy()
    })
})
