export default class SseResponse {
    public readonly data: any = {}

    public readonly dataCallback: () => Promise<any>

    public readonly intervalTime: number = 3000

    constructor(data: any, callback: () => Promise<any>, intervalTime?: number) {
        this.data = data || null
        this.dataCallback = callback || null
        this.intervalTime = intervalTime || 3000
    }

    public static send(
        data: any,
        dataCallback: () => Promise<any>,
        intervalTime = 3000
    ): SseResponse {
        return new SseResponse(data, dataCallback, intervalTime)
    }
}
