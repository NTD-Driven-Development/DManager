import { Express, Router, Request, NextFunction } from "express"
import { IResponse } from "../src/core/interfaces/IHttp"
import sysLog from "../src/middlewares/sysLog"
import sysErrorLog from "../src/middlewares/sysErrorLog"
import responseHandler from "../src/middlewares/responseHandler"
import sseHandler from "../src/middlewares/sseHandler"
import notFoundHandler from "../src/middlewares/notFoundHandler"
import errorHandler from "../src/middlewares/errorHandler"
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
        // compression(),
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
        // mount sysLog
        this.app.use(sysLog)
        // mount sysErrorLog
        this.app.use(sysErrorLog)

        this.setMiddlewares()
        this.setProviders()
        this.setRoutes()

        // mount responseHandler
        this.app.use(responseHandler)
        // mount sseHandler
        this.app.use(sseHandler)
        // mount notFoundHandler
        this.app.use(notFoundHandler)
        // mount errorHandler
        this.app.use(errorHandler)

        // set default timezone
        moment.tz.setDefault(process.env.NODE_TIMEZONE || "Asia/Taipei")
    }

    getExpressApp(): Express {
        return this.app
    }
}

export default new App()
