import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiPaginator, ApiResponse, Options, PaginationQueries, PaginationResponse } from '~/core/api';
import _ from 'lodash';
import * as Model from '~/src/model';

const PREFIX = '/api/notes';

export class BoarderNotePaginator extends ApiPaginator<BoarderNote, BoarderNotePaginationQueries> {
    constructor(options?: Options) {
        super(options);
        this._queries.value.limit = 20;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<PaginationResponse<BoarderNote>>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/boarder?${searchParams}`);
    }

    withQuery = <K extends keyof BoarderNotePaginationQueries, V extends BoarderNotePaginationQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
    }

    protected projectIdHandler = _.throttle(this.setQuery, 800);
    protected searchHandler = _.throttle(this.setQuery, 800);
}

export class BoarderNoteCaller extends ApiCaller<BoarderNote> {
    id?: number;

    constructor(id?: number) {
        const options: Options = {
            immediate: !_.isNil(id),
        };
        super(options);
        this.id = id;
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<BoarderNote>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/boarder/${this?.id}?${searchParams}`);
    }
}

export const createBoarderNote =async (formData: CreateBoarderNoteFormData) => {
    try {
        const response = await axios.post(`${PREFIX}/boarder`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const updateBoarderNote = async (formData: UpdateBoarderNoteFormData) => {
    try {
        const response = await axios.put(`${PREFIX}/boarder`, formData);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

export const deleteBoarderNote = async (id: number) => {
    try {
        const response = await axios.delete(`${PREFIX}/boarder/${id}`);
        return response.data;
    }
    catch(error) {
        throw error;
    }
}

type Boarder = Model.Boarder & {
    class: Model.Class,
    project: Model.Project,
    project_bunk: Model.Bunk,
}

type BoarderNote = Model.BoarderNote & Model.CreateInfo & Model.UpdateInfo & {
    boarder: Boarder
}

interface CreateBoarderNoteFormData {
    boarder_id: string,
    title: string,
    description: string,
}

interface UpdateBoarderNoteFormData {
    id: number,
    title: string,
    description: string,
}

interface BoarderNotePaginationQueries extends PaginationQueries {
    project_id?: number,
    search?: string,
}