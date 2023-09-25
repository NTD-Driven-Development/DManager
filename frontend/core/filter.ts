import { WatchSource } from 'vue';
import _ from 'lodash';

export class Filter<T> {
    protected _source = ref() as Ref<T[]|undefined>;
    protected _filterItems = ref([]) as Ref<T[]>;
    source = shallowReadonly(this._source);
    filterItems = shallowReadonly(this._filterItems);

    constructor(content?: FilterContent<T>) {
        this._source.value = _.cloneDeep(content)?.items ?? [];
    }

    // 清除選中項目列表 並設定資料來源
    setSource = (items: T[]) => {
        if (!items) throw Error(`the param 'items' can not be null.`);

        this._source.value =  _.cloneDeep(items) ?? [];
        this._filterItems.value = [];
    }

    // 篩選符合運算式的項目 並覆蓋至項目列表
    filterWith = (expression: (it: T) => Boolean) => {
        const items = this._source.value?.filter(expression) ?? [];
        this._filterItems.value = items;
    }

    // 取消選取指定項目
    toggle = (expression: (it: T) => Boolean) => {
        const targetItem = this._source.value?.find(expression);
        const existIndex = this._filterItems?.value?.findIndex(expression) ?? -1;

        if (existIndex != -1) {
            const copyItems = this._filterItems.value?.slice(0) ?? [];
            copyItems?.splice(existIndex, 1);
            this._filterItems.value = copyItems;
        }
        else if (targetItem) {
            const copyItems = this._filterItems.value?.slice(0) ?? [];
            copyItems?.push(targetItem);
            this._filterItems.value = copyItems;
        }
        else {
            throw Error('can not find item with the specific expression.');
        }
    }

    // 清除選中項目列表
    removeFilterItems = () => {
        this._filterItems.value = [];
    }
}

export interface FilterContent<T> {
    readonly items: T[],
}

export const withWatcher = <T, O>(ref: WatchSource<T>, expression: (n: T, v: T, c: (cleanupFn: () => void) => void) => O[]) => {
    const filter = new Filter<O>();
    const stopHandler = watch(ref, (n, o, c) => {
        filter.setSource(expression(n, o, c));
    });
    return { filter, stopHandler };
}