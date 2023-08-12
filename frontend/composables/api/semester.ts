import axios, { AxiosResponse } from 'axios';
import { ApiPaginator, ApiResponse, PaginationResponse } from '~/core/api';
import * as Model from '~/src/model';

export class SemesterPaginator extends ApiPaginator<Semester> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<Semester>>, any>> {
        return axios.get('/semesters');
    }
}

type Semester = Model.Semester