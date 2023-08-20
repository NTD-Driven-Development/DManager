import axios, { AxiosResponse } from 'axios';
import { ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/boarders';

export class BoarderPaginator extends ApiPaginator<Boarder, BoarderPaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<Boarder>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}?${searchParams}`);
    }

    withQuery = <K extends keyof BoarderPaginationQueries, V extends BoarderPaginationQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
    };

    protected projectIdHandler = _.throttle(this.setQuery, 800);
}

export const createBoarder = async (formData: CreateBoarderFormData) => {
    try {
        const response = await axios.post(`${PREFIX}`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type Boarder = Model.Boarder

interface CreateBoarderFormData {
    project_id: number,
    floor: number,
    room_type: string,
    room_no: number,
    bed: number,
    sid: string,
    name: string,
    class: number,
    boarder_status_id: number,
    remark?: string,
}

interface BoarderPaginationQueries extends PaginationQueries {
    project_id?: number,
}