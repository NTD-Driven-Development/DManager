import { ProjectModel } from "../../../models/Project"
import { ProjectBunkModel } from "../../../models/ProjectBunk"

export default interface IFindOneProjectResultDto extends ProjectModel {
    bunks?: ProjectBunkModel[]
}
