<template>
    <Title>{{ `記事管理 - Dormiday` }}</Title>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 選擇項目 -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">選擇項目：</div>
            <Select name="selectedProjectId" class="shadow border text-xs"
            :options="projectList" option-key="id" option-value="name"></Select>
        </div>
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 操作 -->
            <div class="flex flex-col gap-2 lg:flex-row">
                <BoarderNoteCreate :project-id="values?.selectedProjectId ?? NaN" class="grow-[1] lg:basis-1"
                @on-created="boarderNotePaginator?.reload()"
                v-if="authStore?.hasAnyRole([UserRole.Editor])"></BoarderNoteCreate>
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5"
                v-if="false">
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <Input name="search" placeholder="搜尋樓寢床、姓名、標題、敘述" class="text-xs w-full rounded border"/>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="boarderNoteList">
                    <template #樓寢床="{ data }">
                        <div class="px-2 py-1">
                            {{ checkValueEmpty(data?.boarder?.project_bunk, (v) => toStringlish(v)) }}
                        </div>
                    </template>
                    <template #姓名="{ data }">{{ checkValueEmpty(data?.boarder?.name) }}</template>
                    <template #標題="{ data }">{{ checkValueEmpty(data?.title) }}</template>
                    <template #敘述="{ data }">
                        <div class="whitespace-pre-wrap break-all max-w-[200px]">
                            {{ checkValueEmpty(data?.description) }}
                        </div>
                    </template>
                    <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                    <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                    <template #操作="{ id }">
                        <div class="flex gap-2 text-base">
                            <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="boarderNoteEditPopUp?.show(id)"
                            v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                            <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="boarderNoteDeletePopUp?.show(id)"
                            v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                        </div>
                    </template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="boarderNotePaginator"></Paginator>
        </div>
        <BoarderNoteEditPopUp ref="boarderNoteEditPopUp" @on-edited="boarderNotePaginator?.reload()"></BoarderNoteEditPopUp>
        <BoarderNoteDeletePopUp ref="boarderNoteDeletePopUp" @on-deleted="boarderNotePaginator?.reload()"></BoarderNoteDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { useAuthStore } from '~/stores/auth';
    import { ProjectsCaller } from '~/composables/api/share';
    import { BoarderNotePaginator } from '~/composables/api/note';
    import _ from 'lodash';

    const headers = [
        { title: '樓寢床', values: ['boarder'] },
        { title: '姓名', values: ['boarder'] },
        { title: '標題', values: ['title'] },
        { title: '敘述', values: ['description'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: [] }
    ]

    const { setFieldValue, values } = useForm<{
        selectedProjectId?: number,
        search?: string,
    }>();
    const authStore = useAuthStore();

    const boarderNoteEditPopUp = ref();
    const boarderNoteDeletePopUp = ref();

    const projectsCaller = new ProjectsCaller()
    const { data: projectList } = projectsCaller;
    const boarderNotePaginator = new BoarderNotePaginator({ immediate: false });
    const { data: boarderNoteList } = boarderNotePaginator;
    
    boarderNotePaginator?.bind('project_id', toRef(values, 'selectedProjectId'));
    boarderNotePaginator?.bind('search', toRef(values, 'search'));

    queryStringInspecter(boarderNotePaginator?.queries);

    onMounted(() => {
        Promise.all([
            projectsCaller?.wait(),
        ])
        .then(() => {
            const query = useRouter().currentRoute?.value?.query;

            boarderNotePaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
            boarderNotePaginator.withQuery('project_id', +(query?.project_id ?? NaN) ? +query.project_id! : projectList?.value?.length ? projectList?.value?.[0].id : undefined);
            boarderNotePaginator.withQuery('search', query?.search ? `${query?.search}` : '');

            setFieldValue('selectedProjectId', +(query?.project_id ?? NaN) ? +query.project_id! : projectList?.value?.[0].id);
            setFieldValue('search', query?.search ? `${query?.search}` : '');

        });
    });
</script>