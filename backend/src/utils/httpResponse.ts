export default class HttpResponse {
    public readonly data: any = {}

    public readonly error: string | null = null

    public readonly statusCode: number = 200

    constructor(
        data: any,
        error?: string | null,
        statusCode?: number
    ) {
        this.data = data || null
        this.error = error || null
        this.statusCode = statusCode || 200
    }

    public static success(
        data: any,
        statusCode = 200
    ): HttpResponse {
        return new HttpResponse(data, null, statusCode)
    }

    public static failure(
        errorMessage: string | null,
        statusCode = 500
    ): HttpResponse {
        return new HttpResponse(null, errorMessage, statusCode)
    }
}
