import axios, { AxiosResponse } from "axios";
import { ApiCaller, ApiResponse, Options, Queries } from "~/core/api";
import * as Model from "~/src/model";
import _ from 'lodash';

const PREFIX = '/api/exports';

export class ExportCaller extends ApiCaller<ExportItem[], ExportCallerQueries> {
    abortController?: AbortController;

    constructor(options?: Options) {
        super(options);
        this.startQueriesWatcher();
    }
    
    protected define(): Promise<AxiosResponse<ApiResponse<ExportItem[]>, any>> {
        const queries = this._queries.value;
        let searchParams = new URLSearchParams();

        if (queries) {
            Object.entries(queries).forEach((it) => {
                searchParams.append(it[0], `${it[1] ?? ''}`);
            });
        }

        this.abortController && this.abortController?.abort();
        this.abortController = new AbortController();

        return axios.get(`${PREFIX}/pointsCheck?${searchParams}`, {
            signal: this.abortController?.signal,
        });
    }

    withQuery = <K extends keyof ExportCallerQueries, V extends ExportCallerQueries[K]>(key: K, value: V) => {
        if (key === 'project_id') {
            this.projectIdHandler(key, value);
        }
        else if (key === 'search') {
            this.searchHandler(key, value);
        }
    }

    protected projectIdHandler = _.debounce(this.setQuery, 500);
    protected searchHandler = _.debounce(this.setQuery, 500);
}

type Boarder = Model.Boarder & {
    project_bunk: Model.Bunk,
    class: Model.Class,
    boarder_status: Model.BoarderStatus,
    boarder_roles: Model.BoarderRole[],
}

type PointLog = Model.PointLog & Model.CreateInfo & {
    point_rule: Model.PointRule,
}

type TelCardLog = Model.TelCardLog & Model.CreateInfo & {
    tel_card_contacter: Model.TelCardContacter,
}

export interface ExportItem {
    boarder: Boarder,
    point_logs: PointLog[],
    tel_card_logs: TelCardLog[],
}

interface ExportCallerQueries extends Queries {
    project_id?: number,
    search?: string,
}