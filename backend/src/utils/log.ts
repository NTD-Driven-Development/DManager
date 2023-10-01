const logFormatJson = (info: any) => {
    const infoSequelizeDetail = info?.dataValues ?? info ?? {}
    const obj = {
        ...infoSequelizeDetail,
    }
    return JSON.stringify(obj)
}

export default {
    logFormatJson,
}
