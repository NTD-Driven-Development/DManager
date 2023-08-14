import axios, { AxiosResponse } from 'axios';
import { ApiPaginator, ApiResponse, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/boarders';

export class BoarderPaginator extends ApiPaginator<Boarder, BoarderPaginationQueries> {
    constructor() {
        super();
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
        if (key === 'semester_id') {
            this.semesterIdHandler(key, value);
        }
    };

    protected semesterIdHandler = _.throttle(this.setQuery, 800);
}

type Boarder = Model.Boarder

interface BoarderPaginationQueries extends PaginationQueries {
    semester_id: number,
}