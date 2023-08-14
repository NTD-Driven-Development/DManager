import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiResponse } from '~/core/api';
import * as Model from '~/src/model';

const PREFIX = '/share';

export class ProjectCaller extends ApiCaller<Project[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Project[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/projects?${searchParams}`);
    }
}

type Project = Model.Project