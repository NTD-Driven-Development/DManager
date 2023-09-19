import { Request } from "express"
import _ from "lodash"
import router from "../routes"
import { IRequest } from "../core/interfaces/IHttp"

interface IRoute {
    path: string
    method: string
}

const toRoutePath = (path: string): string => {
    return _.replace(_.replace(path, "/^\\/", ""), "\\/?(?=\\/|$)/i", "")
}

const getApiRouteList = (): IRoute[] => {
    const routerList: IRoute[] = []
    _.forEach(router.stack, (middleware: any) => {
        if (middleware.name === "router") {
            const routerPath = toRoutePath(middleware.regexp)
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    const fullPath = "/api/" + routerPath + handler.route.path
                    _.forEach(handler.route.stack, (route) => {
                        routerList.push({
                            path: fullPath,
                            method: _.toUpper(route.method),
                        })
                    })
                }
            })
        }
    })
    return _.uniqWith(routerList, _.isEqual)
}

const getApiRouteFullPathFromRequest = (req: IRequest): string => {
    const { routeUrl, baseUrl, route } = req
    // 取得當前路由的完整路徑
    const path = toRoutePath(route.path)
    const full_path = routeUrl ?? _.concat(baseUrl, path).join("")
    return full_path
}

export default {
    getApiRouteList,
    getApiRouteFullPathFromRequest,
}
