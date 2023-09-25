<template>
    <table class="w-full">
        <thead class="border">
                <td v-for="value, key in (headers as HS)" class="border border-gray-300 bg-gray-100"
                @click="onColumnClick(key as string)">
                    <div class="flex justify-center items-center relative min-w-fit text-sm py-2 font-semibold truncate"
                    :class="sortableList.includes(value?.sort ?? '') ? 'px-6' : 'px-3'">
                        {{ key }}
                        <div class="absolute right-1.5 sm:right-1" :class="{'invisible': !sortableList.includes(value?.sort ?? '')}">
                            <svg class="transition-all ease-in-out sm:w-3.5 sm:h-3.5" :class="key == sortByColumnKey && !desc ? 'opacity-100' : 'opacity-30'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6.7 14.7q-.275-.275-.275-.7q0-.425.275-.7l4.6-4.6q.15-.15.325-.213q.175-.062.375-.062t.388.075q.187.075.312.2l4.6 4.6q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 10.8l-3.9 3.9q-.275.275-.7.275q-.425 0-.7-.275Z"/></svg>
                            <svg class="transition-all ease-in-out sm:w-3.5 sm:h-3.5 rotate-180" :class="key == sortByColumnKey && desc ? 'opacity-100' : 'opacity-30'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6.7 14.7q-.275-.275-.275-.7q0-.425.275-.7l4.6-4.6q.15-.15.325-.213q.175-.062.375-.062t.388.075q.187.075.312.2l4.6 4.6q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 10.8l-3.9 3.9q-.275.275-.7.275q-.425 0-.7-.275Z"/></svg>
                        </div>
                    </div>
                </td>
        </thead>
        <tbody class="border">
            <tr v-for="row in sortedRows">
                <td v-for="value, key in (headers as HS)" class="border border-gray-300 px-1.5">
                    <div class="flex justify-center text-xs text-gray-700 truncate">
                        <slot :name="`${key as string}`" :data="(toEntires(value, row) as any)" :id="_.get(row, id) ?? null"></slot>
                        <!-- <slot :name="`${key as string}`"></slot> -->
                    </div>
                </td>
            </tr>
            <slot name="extend.body"></slot>
        </tbody>
    </table>
</template>

<script setup lang="ts" generic="M extends any, HS extends Headers<M>">
    import _ from 'lodash';

    export type Value<T> = keyof T;
    export type Header<T> = { values?: Value<T>[], sort?: 'number' | 'string' | string, transformer?: Function }
    export type Headers<T> = Record<string, Header<T>>

    type DynamicIndexSignature<T, V extends Value<T>[] | undefined> = V extends Value<T>[] ? {
        [K in Extract<Value<T>, keyof T>]: T[K];
    } : {};

    interface Props {
        id: string,
        headers: HS,
        rows?: readonly M[],
    }

    const props = withDefaults(defineProps<Props>(), {
        rows: () => [],
    });

    type HasValues<T> = T extends { values?: infer V } ? V : never;

    defineSlots<{ [G in keyof HS]?: (props: { data: HS, id: any }) => any } & { [`extend.body`]?: () => any }>();

    const sortByColumnKey = ref<string>();
    const desc = ref(false); //是否降序
    const sortableList = readonly(['string', 'number']);

    const onColumnClick = (key: string) => {
        if (!sortableList.includes(props.headers[key]?.sort ?? '')) return;

        if (sortByColumnKey.value == key) {
            desc.value = !desc.value;
            if (!desc.value) {
                sortByColumnKey.value = undefined;
            }
        }
        else {
            desc.value = false; //重置為升序
            sortByColumnKey.value = key;
        }
    };

    const toEntires = (header: Header<M>, row: any) => {
        const o = {};
        header?.values?.forEach(it => {
            _.set(o, it, _.get(row, it));
        });
        return o;
    }

    const sortedRows = computed(() => {
        const sortKey = sortByColumnKey.value;
        const copyRows = [...props.rows];

        if (!sortKey || !_.has(props.headers, sortKey)) return copyRows;

        const sort = props.headers[sortKey]?.sort;
        const values = props.headers[sortKey]?.values ?? [];
        const transform = props.headers[sortKey]?.transformer;

        if (sort == 'number') {
            const transformedValues = copyRows.map((it) => parseInt(transform?.apply(this, values.map((value: any) => _.get(it, value)))));

            if (transformedValues.some((it) => Number.isNaN(parseInt(it.toString())))) {
                console.error(`Column ${sortKey} contains values ​​other than numeric.`);
                sortByColumnKey.value = undefined;
                desc.value = false;
                return copyRows;
            }
            if (desc.value) {
                return copyRows.sort((a,b) => {
                    if (transform?.apply(this, values?.map((value: any) => _.get(a, value))) > transform?.apply(this, values?.map((value: any) => _.get(b, value)))) return -1;
                    else if (transform?.apply(this, values?.map((value: any) => _.get(b, value))) > transform?.apply(this, values?.map((value: any) => _.get(a, value)))) return 1;
                    return 0; 
                });
            }
            else {
                return copyRows.sort((a,b) => {
                    if (transform?.apply(this, values?.map((value: any) => _.get(a, value))) > transform?.apply(this, values?.map((value: any) => _.get(b, value)))) return 1;
                    else if (transform?.apply(this, values?.map((value: any) => _.get(b, value))) > transform?.apply(this, values?.map((value: any) => _.get(a, value)))) return -1;
                    return 0; 
                });
            }
        }
        else if (sort == 'string') {
            if (desc.value) {
                return copyRows.sort((a,b) => {
                    if (transform?.apply(this, values?.map((value: any) => _.get(a, value))) > transform?.apply(this, values?.map((value: any) => _.get(b, value)))) return -1;
                    else if (transform?.apply(this, values?.map((value: any) => _.get(b, value))) > transform?.apply(this, values?.map((value: any) => _.get(a, value)))) return 1;
                    return 0; 
                });
            }
            else {
                return copyRows.sort((a,b) => {
                    if (transform?.apply(this, values?.map((value: any) => _.get(a, value))) > transform?.apply(this, values?.map((value: any) => _.get(b, value)))) return 1;
                    else if (transform?.apply(this, values?.map((value: any) => _.get(b, value))) > transform?.apply(this, values?.map((value: any) => _.get(a, value)))) return -1;
                    return 0; 
                });
            }
        }
        return copyRows;
    });
</script>