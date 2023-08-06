import { Express } from "express"

export default interface IProvider {
    app: Express
    boot(): void
}