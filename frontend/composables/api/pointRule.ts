import axios, { AxiosResponse } from "axios";
import { ApiPaginator, ApiResponse, PaginationResponse, PaginationQueries, Options, ApiCaller } from "~/core/api";
import _ from "lodash";
import * as Model from "~/src/model";

const PREFIX = '/api/pointRules';

export class PointRulePaginator extends ApiPaginator<PointRule, PointRulePaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<PointRule>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}?${searchParams}`);
    }
}

export class PointRuleCaller extends ApiCaller<PointRule> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PointRule>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/${this?.id}?${searchParams}`);
    }
}

export const createPointRule = async (formData: CreatePointRuleFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updatePointRule = async (formData: UpdatePointRuleFormData) => {
    try {
        const response = await axios.put(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type PointRule = Model.PointRule & Model.CreateInfo & Model.UpdateInfo

interface BasePointRuleFormData {
    code: string,
    reason: string,
    point: number,
}

type CreatePointRuleFormData = BasePointRuleFormData

type UpdatePointRuleFormData = BasePointRuleFormData & {
    id: number,
}

interface PointRulePaginationQueries extends PaginationQueries {
}