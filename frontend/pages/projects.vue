<template>
    <Title>{{ `項目管理 - Dormiday` }}</Title>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3 lg:gap-4">
            <!-- 操作 -->
            <div class="flex flex-col gap-2 lg:flex-row">
                <ProjectCreate class="grow-[1] lg:basis-1" @on-created="projectPaginator?.reload()"
                v-if="authStore?.hasAnyRole([UserRole.Editor])"></ProjectCreate>
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button class="py-2 text-white bg-gray-600 rounded" @click="projectImportPopUp?.show()"
                        v-if="authStore?.hasAnyRole([UserRole.Editor])">匯入項目</button>
                        <button class="py-2 text-white bg-gray-600 rounded" @click="projectExportPopUp?.show()">匯出項目</button>
                    </div>
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <Input name="search" placeholder="搜尋名稱" class="text-xs w-full rounded border"/>
            </div>
            <!-- 列表 -->
            <div class="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                <TransitionGroup
                enter-active-class="transition-all duration-300"
                leave-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-x-48"
                leave-to-class="opacity-0 -translate-x-48">
                    <Detail v-for="it, index in projectList" :key="index" class="bg-white">
                        <template #summary="{ isVisable }">
                            <div class="flex justify-between items-center w-full h-full">
                                <div class="flex flex-col flex-1 justify-center">
                                    <span>{{ it?.name }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Icon icon="ic:round-mode-edit" class="w-5 h-5 duration-300 cursor-pointer" @mousedown.stop @mouseup.stop="projectEditPopUp?.show(it?.id)"
                                    v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                                    <Icon icon="ic:round-keyboard-arrow-down" class="w-6 h-6 duration-300" :class="[{ 'rotate-180': isVisable }]"></Icon>
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <div class="text-sm">
                                {{ checkValueEmpty(it?.remark, undefined, '--') }}
                            </div>
                        </template>
                    </Detail>
                </TransitionGroup>
            </div>
            <Paginator :api-paginator="projectPaginator"></Paginator>
        </div>
        <ProjectImportPopUp ref="projectImportPopUp" @on-imported="projectPaginator?.reload()"></ProjectImportPopUp>
        <ProjectExportPopUp ref="projectExportPopUp"></ProjectExportPopUp>
        <ProjectEditPopUp ref="projectEditPopUp" @on-edited="projectPaginator?.reload()"></ProjectEditPopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { useAuthStore } from '~/stores/auth';
    import { ProjectPaginator } from '~/composables/api/project';
    import _ from 'lodash';

    const { setFieldValue, values } = useForm<{
        search?: string,
    }>();
    const authStore = useAuthStore();

    const projectImportPopUp = ref();
    const projectExportPopUp = ref();
    const projectEditPopUp = ref();

    const projectPaginator = new ProjectPaginator({ immediate: false });
    const { data: projectList } = projectPaginator;

    projectPaginator.bind('search', toRef(values, 'search'));

    queryStringInspecter(projectPaginator.queries, { deep: true });

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRouter().currentRoute.value.query;

            setFieldValue('search', query?.search ? `${query?.search}` : '');

            projectPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
        });
    });
</script>