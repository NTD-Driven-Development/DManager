declare namespace Dao {
    interface IDao {
        findOneById(id: string | number): Promise<any>
        findAll(): Promise<any[]>
        create(item: any): Promise<any>
        update(item: any): Promise<IExecuteResult>
        delete(id: string | number, ...any:any): Promise<IExecuteResult>
    }

    interface IExecuteResult {
        affectedRows: number
    }
}

export default Dao