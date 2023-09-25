import axios, { AxiosResponse } from "axios";
import { ApiPaginator, ApiResponse, PaginationResponse, PaginationQueries, Options, ApiCaller } from "~/core/api";
import _ from "lodash";
import * as Model from "~/src/model";

const PREFIX = '/api/boarderStatuses';

export class BoarderStatusPaginator extends ApiPaginator<BoarderStatus, BoarderStatusPaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<BoarderStatus>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}?${searchParams}`);
    }

    withQuery = <K extends keyof BoarderStatusPaginationQueries, V extends BoarderStatusPaginationQueries[K]>(key: K, value: V) => {
    }
}

export class BoarderStatusCaller extends ApiCaller<BoarderStatus> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<BoarderStatus>, any>> {
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

export const createBoarderStatus = async (formData: CreateBoarderStatusFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateBoarderStatus = async (formData: UpdateBoarderStatusFormData) => {
    try {
        const response = await axios.put(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteBoarderStatus = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type BoarderStatus = Model.BoarderStatus & Model.CreateInfo & Model.UpdateInfo

interface BaseBoarderStatusFormData {
    name: string,
}

type CreateBoarderStatusFormData = BaseBoarderStatusFormData

type UpdateBoarderStatusFormData = BaseBoarderStatusFormData & {
    id: number,
}

interface BoarderStatusPaginationQueries extends PaginationQueries {
}