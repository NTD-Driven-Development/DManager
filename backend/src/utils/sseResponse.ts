export default class SseResponse {
    public readonly data: any = {}

    public readonly dataCallback: any

    public readonly intervalTime: number = 3000

    constructor(data: any, callback: any, intervalTime?: number) {
        this.data = data || null
        this.dataCallback = callback || null
        this.intervalTime = intervalTime || 3000
    }

    public static success(
        data: any,
        dataCallback: any,
        intervalTime = 3000
    ): SseResponse {
        return new SseResponse(data, dataCallback, intervalTime)
    }
}
