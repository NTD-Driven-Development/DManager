interface boarders {
    id: string
    name: string
    boarder_status_id: number
}

interface numbers {
    no: number
    boarders: boarders[]
}

interface rooms {
    type: string
    numbers: numbers[]
}

export default interface AreaOfBoarderStatus {
    floor: number
    rooms: rooms[]
}
