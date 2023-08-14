import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiResponse, PaginationResponse } from '~/core/api';
import { Semester } from '~/src/model';

export default defineNuxtPlugin(() => {
    let mock = new MockAdapter(axios)

    mock.onGet('/semesters').reply(200, createPaginationResponse<Semester>({
        from: 1,
        to: 10,
        total: 100,
        per_page: 10,
        current_page: 1,
        last_page: 10,
        items: [
            { id: 1, name: '110上學期', remark: '備註' },
            { id: 2, name: '110下學期' },
            { id: 3, name: '110上學期', remark: '備註' },
            { id: 4, name: '110下學期' },
            { id: 5, name: '110上學期', remark: '備註' },
            { id: 6, name: '110下學期' },
            { id: 7, name: '110上學期', remark: '備註' },
            { id: 8, name: '110下學期' },
        ],
    }));
})

const createPaginationResponse = <T, P = PaginationResponse<T>>(data: P, message = 'OK', status = 200, success = true): ApiResponse<P> => {
    return {
        data,
        message,
        status,
        success,
    }
}