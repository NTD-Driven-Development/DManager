<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 選擇 -->
        <Select name="selectSemester" :options="semesterList" option-key="id" option-value="name" class="shadow border text-xs"></Select>
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <BoarderAdd class="grow-[3] lg:basis-1"></BoarderAdd>
            <div class="grow-[4] bg-white h-auto border rounded p-3 text-sm lg:basis-1">
                <div class="grid grid-cols-2 gap-3">
                    <!-- <button class="px-8 py-2 text-white bg-gray-600 rounded">匯入</button>
                    <button class="px-8 py-2 text-white bg-gray-600 rounded">複製自</button> -->
                </div>
            </div>
        </div>
        <!-- 列表 -->
        <div class="flex flex-col gap-2">
            <div class="w-full lg:w-64">
                <input placeholder="搜尋住宿生名稱" class="px-5 text-xs w-full h-full rounded"
                @change=""/>
            </div>
            <div class="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                <Detail v-for="it, index in projectList1" :key="index" class="bg-white">
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
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { ProjectPaginator } from '~/composables/api/project';
    import { ProjectCaller } from '~/composables/api/share';

    const { setFieldValue } = useForm(); 
    const projectPaginator = new ProjectPaginator();
    const { data: projectList1 } = projectPaginator;
    const semesterCaller = new ProjectCaller()
    .success((v) => setFieldValue('selectSemester', v?.data[0]?.id));
    const { data: semesterList } = semesterCaller;
</script>