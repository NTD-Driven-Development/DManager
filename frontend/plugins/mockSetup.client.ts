import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiResponse, PaginationResponse } from '~/core/api';
import { Boarder, Project } from '~/src/model';

export default defineNuxtPlugin(() => {
    let mock = new MockAdapter(axios)

    mock.onGet('/projects?').reply(200, createPaginationResponse<Project>({
        from: 1,
        to: 10,
        total: 100,
        per_page: 10,
        current_page: 1,
        last_page: 10,
        items: [
            { id: 1, name: '110學年', remark: '備註' },
            { id: 2, name: '111學年' },
            { id: 3, name: '112學年', remark: '備註' },
            { id: 4, name: '113學年' },
            { id: 5, name: '114學年', remark: '備註' },
            { id: 6, name: '115學年' },
            { id: 7, name: '116學年', remark: '備註' },
            { id: 8, name: '117學年' },
        ],
    }));

    mock.onGet('/share/projects?').reply(200, createResponse<Project[]>([
        { id: 1, name: '110學年', remark: '備註' },
        { id: 2, name: '111學年' },
        { id: 3, name: '112學年', remark: '備註' },
        { id: 4, name: '113學年' },
        { id: 5, name: '114學年', remark: '備註' },
        { id: 6, name: '115學年' },
        { id: 7, name: '116學年', remark: '備註' },
        { id: 8, name: '117學年' },
    ]));

    mock.onGet('/boarder?project_id=1').reply(200, createPaginationResponse<Boarder>({
        from: 1,
        to: 10,
        total: 100,
        per_page: 10,
        current_page: 1,
        last_page: 10,
        items: [
            { sid: 1, name: '學生1', remark: '備註' },
            { sid: 2, name: '學生2', remark: '備註' },
            { sid: 3, name: '學生3', remark: '備註' },
            { sid: 4, name: '學生4', remark: '備註' },
            { sid: 5, name: '學生5', remark: '備註' },
            { sid: 6, name: '學生6', remark: '備註' },
            { sid: 7, name: '學生7', remark: '備註' },
        ],
    }));
})

const createResponse = <T>(data: T, message = 'OK', status = 200, success = true): ApiResponse<T> => {
    return {
        data,
        message,
        status,
        success,
    }
}

const createPaginationResponse = <T, P = PaginationResponse<T>>(data: P, message = 'OK', status = 200, success = true): ApiResponse<P> => {
    return {
        data,
        message,
        status,
        success,
    }
}