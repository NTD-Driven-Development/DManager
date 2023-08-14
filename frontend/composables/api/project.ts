import axios, { AxiosResponse } from 'axios';
import { ApiPaginator, ApiResponse, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/projects';

export class ProjectPaginator extends ApiPaginator<Project> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<Project>>, any>> {
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

type Project = Model.Project