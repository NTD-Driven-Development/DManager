import { defineStore } from 'pinia';
import _ from 'lodash';

export const useOptionsStore = defineStore('options', () => {
    const selectedOptionType = ref<number>(0);

    return { 
        selectedOptionType,
    };
});