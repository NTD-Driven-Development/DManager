import { BoarderModel } from "../../../models/Boarder"

export default class UpdateBoarderDto implements BoarderModel {
    public readonly id!: string
    public readonly project_id!: number
    public readonly name!: string
    public readonly boarder_status_id!: number
    public readonly sid?: string
    public readonly phone?: string
    public readonly class_id?: number
    public readonly birthday?: Date
    public readonly avatar?: string
    public readonly remark?: string
    public readonly access_card?: string
    public readonly boarder_role_ids!: number[]
}
