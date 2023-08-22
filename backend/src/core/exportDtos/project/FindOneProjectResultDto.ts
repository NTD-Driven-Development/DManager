
import ProjectAttributes from "../../../models/Project";
import ProjectBunkAttributes from "../../../models/ProjectBunk";

export default interface IFindOneProjectResultDto extends ProjectAttributes {
    bunks?: ProjectBunkAttributes[]
}