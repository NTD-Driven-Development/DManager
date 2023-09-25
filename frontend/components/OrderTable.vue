<template>
    <table class="w-full">
        <thead class="border">
                <td v-for="header, index in headers" class="border border-gray-300 bg-gray-100"
                @click="onColumnClick(index)">
                    <div class="flex justify-center items-center relative min-w-fit text-sm py-1 font-semibold truncate"
                    :class="sortableList.includes(header?.sort ?? '') ? 'px-6' : 'px-1'">
                        {{ header.title }}
                        <div class="absolute right-1.5 sm:right-1" :class="{'invisible': !sortableList.includes(header?.sort ?? '')}">
                            <svg class="transition-all ease-in-out sm:w-3.5 sm:h-3.5" :class="index == sortByColumnIndex && !desc ? 'opacity-100' : 'opacity-30'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6.7 14.7q-.275-.275-.275-.7q0-.425.275-.7l4.6-4.6q.15-.15.325-.213q.175-.062.375-.062t.388.075q.187.075.312.2l4.6 4.6q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 10.8l-3.9 3.9q-.275.275-.7.275q-.425 0-.7-.275Z"/></svg>
                            <svg class="transition-all ease-in-out sm:w-3.5 sm:h-3.5 rotate-180" :class="index == sortByColumnIndex && desc ? 'opacity-100' : 'opacity-30'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6.7 14.7q-.275-.275-.275-.7q0-.425.275-.7l4.6-4.6q.15-.15.325-.213q.175-.062.375-.062t.388.075q.187.075.312.2l4.6 4.6q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 10.8l-3.9 3.9q-.275.275-.7.275q-.425 0-.7-.275Z"/></svg>
                        </div>
                    </div>
                </td>
        </thead>
        <tbody class="border">
            <tr v-for="row in sortedRows">
                <td v-for="header in headers" class="border border-gray-300 px-1.5">
                    <div class="flex justify-center text-xs text-gray-700 truncate">
                        <slot :name="`${header.title}`" :data="(toEntires(header, row) as any)" :id="_.get(row, id) ?? null"></slot>
                    </div>
                </td>
            </tr>
            <slot name="extend.body"></slot>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    import _ from 'lodash';
 
    export interface Header {
        title: string,
        values: string[],
        sort?: 'number' | 'string' | string,
        transform?: Function,
    }

    interface Props {
        id: string,
        headers: readonly Header[],
        rows: readonly any[],
    }
    
    const props = withDefaults(defineProps<Props>(), {
        rows: () => [],
    });

    const sortByColumnIndex = ref(-1);
    const desc = ref(false); //是否降序
    const sortableList = readonly(['string', 'number']);

    const onColumnClick = (index: number) => {
        if (!sortableList.includes(props.headers[index]?.sort ?? '')) return;
        if (sortByColumnIndex.value == index) {
            desc.value = !desc.value;
            if (!desc.value) {
                sortByColumnIndex.value = -1;
            }
        }
        else {
            desc.value = false; //重置為升序
            sortByColumnIndex.value = index;
        }
    };

    const toEntires = (header: Header, row: any) => {
        const o = {};
        header.values.forEach(it => {
            _.set(o, it, _.get(row, it));
        });
        return o;
    }

    const sortedRows = computed(() => {
        const sortIndex = sortByColumnIndex.value;
        const copyRows = [...props.rows];
        if (sortIndex == -1 || sortIndex > props.headers.length) return copyRows;
        const sort = props.headers[sortIndex]?.sort;
        const values = props.headers[sortIndex]?.values ?? [];
        const transform = props.headers[sortIndex]?.transform;
        if (sort == 'number') {
            const transformedValues = copyRows.map((it) => parseInt(transform?.apply(this, values.map((value: any) => _.get(it, value)))));
            if (transformedValues.some((it) => Number.isNaN(parseInt(it.toString())))) {
                console.error(`Column ${sortIndex} contains values ​​other than numeric.`);
                sortByColumnIndex.value = -1;
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