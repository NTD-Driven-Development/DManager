interface numbers {
    no: number
    beds: number[]
}

interface room {
    type: string
    numbers: numbers[]
}

export default interface BunkResult {
    floor: number
    rooms: room[]
}