import { defineStore } from 'pinia';
import _ from 'lodash';

export const useRecordsStore = defineStore('records', () => {
    const selectedRecordType = ref<0 | 1>(0);

    return { 
        selectedRecordType,
    };
});