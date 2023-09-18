export default interface AreaOfBoarderStatus {
    boarders: {
        id: string
        name: string
        boarder_status_id: number
        floor: number
        room_type: string
        room_no: number
        bed: number
    }[]
    users: {
        id: number
        name: string
        email: string
        project_bunk: {
            id: number
            floor: string
            room_type: string
            room_no: string
            bed: string
        }
    }[]
}
