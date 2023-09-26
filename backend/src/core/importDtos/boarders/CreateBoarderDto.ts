export default class CreateBoarderDto {
    public readonly project_id!: number
    public readonly floor!: number
    public readonly room_type!: string
    public readonly room_no!: number
    public readonly bed!: number
    public readonly remark?: string
    public readonly name!: string
    public readonly sid?: string
    public readonly class_id?: number
    public readonly boarder_status_id!: number
    public readonly boarder_role_ids?: number[]
}
