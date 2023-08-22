export default interface IPaginationResultDto {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number
    to: number
    items: any
}
