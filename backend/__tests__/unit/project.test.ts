import ProjectService from "../../src/core/services/ProjectService"
import ProjectDao from "../../src/core/daos/ProjectDao"
import Sequelize from "sequelize"

describe("Unit test for ProjectService.", () => {
    const fakeProject = {
        id: 1,
        name: "測試",
        remark: "備註",
        created_at: new Date(),
    }

    function givenCreateProjectPayload() {
        return {
            name: "測試",
            remark: "備註",
        }
    }
    async function whenCreateProject(payload: any) {
        jest.spyOn(ProjectDao, "create").mockResolvedValue(fakeProject)
        return await ProjectService.createProject(payload)
    }

    function givenUpdateProjectPayload() {
        return {
            id: 1,
            name: "測試修改",
            remark: "測試修改",
        }
    }
    async function whenUpdateProject(payload: any) {
        jest.spyOn(ProjectDao, "update").mockResolvedValue({
            affectedRows: 1,
        })
        return await ProjectService.updateProject(payload)
    }
    async function whenUpdateNotFoundProject(payload: any) {
        jest.spyOn(ProjectDao, "update").mockResolvedValue({
            affectedRows: 0,
        })
        return await ProjectService.updateProject(payload)
    }

    function givenDeleteProjectPayload() {
        return 1
    }
    async function whenDeleteProject(payload: any) {
        jest.spyOn(ProjectDao, "delete").mockResolvedValue({
            affectedRows: 1,
        })
        return await ProjectService.deleteProject(payload)
    }
    async function whenDeleteNotFoundProject(payload: any) {
        jest.spyOn(ProjectDao, "delete").mockResolvedValue({
            affectedRows: 0,
        })
        return await ProjectService.deleteProject(payload)
    }

    describe("取得項目列表", () => {
        it("應能正常取得", async () => {
            // given
            const fakeProjectList = [fakeProject]
            
            // when
            jest.spyOn(ProjectDao, "findAll").mockResolvedValue(fakeProjectList)
            const projectList = await ProjectService.getAllProjectsData()

            // then
            expect(projectList).toBe(fakeProjectList)
            expect(ProjectDao.findAll).toBeCalledTimes(1)
        })
    })

    describe("建立項目", () => {
        it("應能正常建立", async () => {
            // given
            const payload = givenCreateProjectPayload()

            // when
            const createdResult = await whenCreateProject(payload)

            // then
            expect(createdResult).toBe(fakeProject)
            expect(ProjectDao.create).toBeCalledTimes(1)
        })
    })

    describe("更新項目", () => {
        it("應能正常更新", async () => {
            // given
            const payload = givenUpdateProjectPayload()

            // when
            const updatedResult = await whenUpdateProject(payload)

            // then
            expect(updatedResult).toBe(true)
            expect(ProjectDao.update).toBeCalledTimes(1)
        })

        it("若此項目不存在應擲出例外「此項目不存在」", async () => {
            // given
            const errorMessage: string = "此項目不存在"
            const payload = givenUpdateProjectPayload()

            // when
            // then
            await expect(whenUpdateNotFoundProject(payload)).rejects.toThrow(errorMessage)
        })
    })

    describe("刪除項目", () => {
        it("應能正常刪除", async () => {
            // given
            const payload = givenDeleteProjectPayload()

            // when
            const updatedResult = await whenDeleteProject(payload)

            // then
            expect(updatedResult).toBe(true)
            expect(ProjectDao.delete).toBeCalledTimes(1)
        })

        it("若此項目不存在應擲出例外「此項目不存在」", async () => {
            // given
            const errorMessage: string = "此項目不存在"
            const payload = givenDeleteProjectPayload()

            // when
            // then
            await expect(whenDeleteNotFoundProject(payload)).rejects.toThrow(errorMessage)
        })
    })
})
