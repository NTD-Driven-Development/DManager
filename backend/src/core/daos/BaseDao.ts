import Core from "../interfaces/IDao"

export default abstract class BaseDao {
    protected async executeResult(
        operation: Promise<any>
    ): Promise<Core.IExecuteResult> {
        const result = await operation
        if (typeof result !== "number") {
            if (typeof result[0] === "object")
                return { affectedRows: result[0]?.affectedRows }
            return { affectedRows: result[0] }
        }
        const affectedRows = result
        return { affectedRows }
    }
}
