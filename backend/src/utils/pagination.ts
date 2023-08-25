import _ from "lodash"

const withPagination = async (
    queryCount: number,
    data: any,
    offset: number = 1,
    limit: number = 20
) => {
    const total = queryCount
    const per_page = _.toInteger(limit)
    const current_page = _.toInteger(offset)
    const last_page =
        Math.ceil(queryCount / per_page) === 0 ? 1 : Math.ceil(queryCount / per_page)
    const from = (current_page - 1) * per_page + 1 < 1 ? 0 : (current_page - 1) * per_page + 1
    const to = offset * limit < queryCount ? offset * limit : queryCount
    // data pagination
    const items = _.slice(data, from - 1, to)

    return { total, per_page, current_page, last_page, from, to, items: items }
}

const validatePagination = async (
    count: number,
    offset: number = 1,
    limit: number = 20
) => {
    const limitMax = parseInt(process.env.DATA_PAGING_LIMIT || "50") || 50
    limit = limit > limitMax ? limitMax : limit

    const offsetMax =
        Math.ceil(count / limit) === 0 ? 1 : Math.ceil(count / limit)
    offset = offset < 1 ? 1 : offset
    offset = offset > offsetMax ? offsetMax : offset
    limit = limit < 1 ? 1 : limit
    return { offset, limit }
}

export { withPagination, validatePagination }
