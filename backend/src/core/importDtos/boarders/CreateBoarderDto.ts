export default class CreateBoarderDto {
    public readonly project_id!: number
    public readonly floor!: string
    public readonly room_type!: string
    public readonly room_no!: string
    public readonly bed!: string
    public readonly remark?: string
    public readonly name!: string
    public readonly sid?: string
    public readonly class_id?: number
    public readonly boarder_status_id!: number
    public readonly boarder_role_ids?: number[]
}
