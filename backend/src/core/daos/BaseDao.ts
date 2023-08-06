import Core from "../interfaces/IDao"

export default abstract class BaseDao {
    protected async executeResult(
        operation: () => Promise<number>
    ): Promise<Core.IExecuteResult> {
        const result = await operation()
        if (typeof result !== "number") {
            return { affectedRows: result[0] }
        }
        const affectedRows = result
        return { affectedRows }
    }
}
