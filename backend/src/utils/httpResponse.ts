export default class HttpResponse {
    public readonly data: any = {}

    public readonly message: string | null = null

    public readonly error: string | null = null

    public readonly statusCode: number = 200

    constructor(
        data: any,
        error?: string | null,
        statusCode?: number,
        message?: string | null
    ) {
        this.data = data || null
        this.error = error || null
        this.statusCode = statusCode || 200
        this.message = message || null
    }

    public static success(
        data: any,
        message: string | null = null,
        statusCode = 200
    ): HttpResponse {
        return new HttpResponse(data, null, statusCode, message)
    }

    public static failure(
        errorMessage: string | null,
        statusCode = 500
    ): HttpResponse {
        return new HttpResponse(null, errorMessage, statusCode, null)
    }
}
