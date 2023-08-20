import axios, { AxiosResponse } from 'axios';
import { ApiCaller, ApiResponse } from '~/core/api';
import * as Model from '~/src/model';

const PREFIX = '/api/share';

export class ProjectsCaller extends ApiCaller<Project[]> {
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

export class BunksCaller extends ApiCaller<Floor[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }
    
    protected define(): Promise<AxiosResponse<ApiResponse<Floor[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/bunks?${searchParams}`);
    }
}

export class BoarderStatusesCaller extends ApiCaller<BoarderStatus[]> {
    constructor() {
        super();
        this.startQueriesWatcher();
    }

    protected define(): Promise<AxiosResponse<ApiResponse<Model.BoarderStatus[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        return axios.get(`${PREFIX}/boarderStatuses?${searchParams}`);
    }
}

type Project = Model.Project

type BoarderStatus = Model.BoarderStatus

interface RoomNo {
    no: number,
    beds: number[],
}

interface Room {
    type: string,
    numbers: RoomNo[],
}

interface Floor {
    floor: number,
    rooms: Room[],
}