export default class HttpException extends Error {
    public readonly statusCode: number
    constructor(msg: string, statusCode: number) {
        super(msg)
        this.statusCode = statusCode
    }
}
