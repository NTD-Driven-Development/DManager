<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <ProjectAdd class="grow-[3] lg:basis-1"></ProjectAdd>
            <div class="grow-[4] bg-white h-auto border rounded p-3 text-sm lg:basis-1">
                <div class="grid grid-cols-2 gap-3">
                    <button class="px-8 py-2 text-white bg-gray-600 rounded">匯入</button>
                    <button class="px-8 py-2 text-white bg-gray-600 rounded">複製自</button>
                </div>
            </div>
        </div>
        <!-- 列表 -->
        <div class="flex flex-col gap-2">
            <div class="w-full lg:w-64">
                <input placeholder="搜尋項目名稱" class="px-5 text-xs w-full h-full rounded"
                @change=""/>
            </div>
            <div class="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                <Detail v-for="it, index in semesterList" :key="index" class="bg-white">
                    <template #summary="{ isVisable }">
                        <div class="flex justify-between items-center w-full h-full">
                            <div class="flex flex-col flex-1 justify-center">
                                {{ it?.name }}
                            </div>
                            <Icon icon="ic:round-keyboard-arrow-up" class="w-6 h-6 duration-300" :class="[{ 'rotate-180': isVisable }]"></Icon>
                        </div>
                    </template>
                    <template #content>
                        <div class="text-sm">
                            {{ it?.remark ?? '尚無備註' }}
                        </div>
                    </template>
                </Detail>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { ProjectPaginator } from '~/composables/api/project';

    const semesterPaginator = new ProjectPaginator();
    const { data: semesterList } = semesterPaginator;
</script>