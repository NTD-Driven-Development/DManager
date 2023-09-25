interface Item {
    sid?: string,
    floor: string,
    room_type: string,
    room_no: string,
    bed: string,
    name: string,
    remark?: string,
    new_boarder_roles: string[],
    class_id?: number,
    new_class?: string,
}

export default class ImportBoardersDto {
    public readonly project_id!: number
    public readonly default_boarder_status_id!: number
    public readonly all_new_boarder_roles!: string[]
    public readonly all_new_classes!: string[]
    public readonly items!: Item[]
}