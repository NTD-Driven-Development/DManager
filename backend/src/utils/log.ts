const logFormatJson = (operationName: string | undefined, info: any) => {
    const infoSequelizeDetail = info?.dataValues ?? info ?? {}
    const obj = {
        operationName,
        ...infoSequelizeDetail,
    }
    return JSON.stringify(obj)
}

export default {
    logFormatJson,
}
