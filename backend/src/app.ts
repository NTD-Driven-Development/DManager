import { Express, Router, Request, Response, NextFunction } from "express"
import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import helmet, { hsts } from "helmet"
import cors from "cors"
import _ from "lodash"
import IProvider from "./providers/IProvider"
import Passport from "./providers/PassportProvider"
import Routes from "./routes"
import HttpResponse from "./utils/httpResponse"
import HttpException from "./exceptions/HttpException"
import ValidationException from "./exceptions/ValidationException"
import moment from "moment"
import "moment-timezone"

interface IApp {
    app: Express
    globalMiddlewares: any[]
    globalProviders: IProvider[]
    setMiddlewares(): void
    setRoutes(): void
    setProviders(): void
    boot(): void
    getExpressApp(): Express
}

class App implements IApp {
    app: Express = express()
    globalMiddlewares: any[] = [
        morgan("dev", {
            // skip: (req, res) => { return res.statusCode < 400 }
        }),
        bodyParser.json({
            get limit() {
                return process.env.BODY_LIMIT || "20mb"
            },
        }),
        bodyParser.urlencoded({ extended: false }),
        cookieParser(),
        compression(),
        helmet({
            crossOriginResourcePolicy: { policy: "same-site" },
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-eval'"],
                },
            },
        }),
        hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }),
        cors({
            origin: "",
            allowedHeaders: ["Authorization", "Content-Type", "X-CSRF-TOKEN"],
        }),
    ]
    globalProviders: IProvider[] = [new Passport(this.app)]

    constructor() {
        this.boot()
    }

    setRoutes(): void {
        this.app.use("/api", Routes)
    }

    setMiddlewares(): void {
        // mount globalMiddlewares
        _.each(this.globalMiddlewares, (middleware) => {
            if (_.isArray(middleware)) {
                this.app.use(middleware[0], middleware[1])
                return
            }
            this.app.use(middleware)
        })
    }

    setProviders(): void {
        // mount providers
        _.each(this.globalProviders, (provider) => {
            provider.boot()
        })
    }

    boot(): void {
        this.setMiddlewares()
        this.setProviders()
        this.setRoutes()

        // catch 404 and forward to error handler
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const err = new HttpException("Not Found", 404)
            return next(err)
        })
        // http response handler
        this.app.use((handle: HttpResponse | any, req: Request, res: Response, next: NextFunction) => {
            if (handle instanceof HttpResponse) 
                return res.status(handle.statusCode).json(handle)
            return next(handle)
        })
        // error handler
        this.app.use(
            (
                err: HttpException | ValidationException | Error,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                if (err instanceof HttpException) {
                    const response: HttpResponse = HttpResponse.failure(
                        err.message,
                        err.statusCode
                    )
                    return res.status(response.statusCode).json(response)
                }
                if (err instanceof ValidationException) {
                    const response: HttpResponse = HttpResponse.failure(
                        err.message,
                        err.statusCode
                    )
                    return res.status(response.statusCode).json(response)
                }
                if (err instanceof Error) {
                    const response: HttpResponse = HttpResponse.failure(
                        err.message
                    )
                    return res.status(response.statusCode).json(response)
                }

                // set default timezone
                moment.tz.setDefault(process.env.NODE_TIMEZONE || "Asia/Taipei")
                return next()
            }
        )
    }

    getExpressApp(): Express {
        return this.app
    }
}

export default new App()
