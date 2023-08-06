import { number } from "yup"

declare namespace Dao {
    interface IDao {
        findOneById(id: string | number): Promise<any>
        findAll(): Promise<any[]>
        create(item: any): Promise<any>
        update(id: string | number, item: any): Promise<IExecuteResult>
        delete(id: string | number): Promise<IExecuteResult>
    }

    interface IExecuteResult {
        affectedRows: number
    }
}

export default Dao