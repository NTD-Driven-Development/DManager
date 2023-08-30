import axios, { AxiosResponse } from "axios";
import { ApiPaginator, ApiResponse, PaginationResponse, PaginationQueries, Options, ApiCaller } from "~/core/api";
import _ from "lodash";
import * as Model from "~/src/model";

const PREFIX = '/api/boarderRoles';

export class BoarderRolePaginator extends ApiPaginator<BoarderRole, BoarderRolePaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<BoarderRole>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}?${searchParams}`);
    }

    withQuery = <K extends keyof BoarderRolePaginationQueries, V extends BoarderRolePaginationQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
    }

    protected projectIdHandler = _.throttle(this.setQuery, 800);
}

export class BoarderRoleCaller extends ApiCaller<BoarderRole> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<BoarderRole>, any>> {
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

export const createBoarderRole = async (formData: CreateBoarderRoleFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateBoarderRole = async (formData: UpdateBoarderRoleFormData) => {
    try {
        const response = await axios.put(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type BoarderRole = Model.BoarderRole

interface BaseBoarderRoleFormData {
    project_id: number,
    name: string,
}

type CreateBoarderRoleFormData = BaseBoarderRoleFormData

type UpdateBoarderRoleFormData = BaseBoarderRoleFormData & {
    id: number,
}

interface BoarderRolePaginationQueries extends PaginationQueries {
    project_id?: number,
}