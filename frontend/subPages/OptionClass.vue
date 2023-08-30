<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionClassCreate class="grow-[1] max-w-sm lg:basis-1"
            @on-created="classPaginator?.reload()"></OptionClassCreate>
        </div>
        <!-- 搜尋 -->
        <div class="w-full lg:w-64 border">
            <input placeholder="搜尋名稱" class="text-xs w-full rounded"
            @change=""/>
        </div>
        <!-- 列表 -->
        <div class="w-full overflow-auto bg-white">
            <OrderTable id="id" :headers="headers" :rows="classList">
                <template #名稱="{ data }">
                    <div class="px-2 py-1">
                        {{ data?.name }}
                    </div>
                </template>
                <template #建立時間="{ data }">{{ toSimpleDate(data?.created_at) ?? '--' }}</template>
                <template #建立者="{ data }">{{ data?.created_by ?? '--' }}</template>
                <template #更新時間="{ data }">{{ toSimpleDate(data?.created_at) ?? '--' }}</template>
                <template #更新者="{ data }">{{ data?.created_by ?? '--' }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2">
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionClassEditPopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="classPaginator"></Paginator>
        <!-- <OptionClassEditPopUp ref="optionClassEditPopUp"></OptionClassEditPopUp> -->
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { ClassPaginator } from '~/composables/api/class';

    const headers = [
        { title: '名稱', values: ['name'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['created_by'] },
        { title: '更新時間', values: ['created_at'] },
        { title: '更新者', values: ['created_by'] },
        { title: '操作', values: [] }
    ]

    const optionClassEditPopUp = ref();

    const classPaginator = new ClassPaginator();
    const { data: classList } = classPaginator;
</script>