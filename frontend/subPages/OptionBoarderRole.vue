<template>
    <div class="flex flex-col gap-3">
        <!-- 選擇項目 -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">選擇項目：</div>
            <Select name="selectedProjectId" class="shadow border text-xs"
            :options="projectList" option-key="id" option-value="name"></Select>
        </div>
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionBoarderRoleCreate :project-id="values?.selectedProjectId ?? NaN" class="grow-[1] lg:basis-1"
            @on-created="boarderRolePaginator?.reload()"
            v-if="authStore?.hasAnyRole([UserRole.Editor])"></OptionBoarderRoleCreate>
            <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5"
            v-if="false">
            </div>
        </div>
        <!-- 搜尋 -->
        <div class="w-full lg:w-64 border">
            <input placeholder="搜尋名稱" class="text-xs w-full rounded"
            @change=""/>
        </div>
        <!-- 列表 -->
        <div class="w-full overflow-auto bg-white">
            <OrderTable id="id" :headers="headers" :rows="boarderRoleList">
                <template #名稱="{ data }">
                    <div class="px-2 py-1">
                        {{ checkValueEmpty(data?.name) }}
                    </div>
                </template>
                <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2 text-base">
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionBoarderRoleEditPopUp?.show(id)"
                        v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                        <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="optionBoarderRoleDeletePopUp?.show(id)"
                        v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="boarderRolePaginator"></Paginator>
        <OptionBoarderRoleEditPopUp ref="optionBoarderRoleEditPopUp" @on-edited="boarderRolePaginator?.reload()"></OptionBoarderRoleEditPopUp>
        <OptionBoarderRoleDeletePopUp ref="optionBoarderRoleDeletePopUp" @on-deleted="boarderRolePaginator?.reload()"></OptionBoarderRoleDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { useAuthStore } from '~/stores/auth';
    import { useOptionsStore } from '~/stores/options';
    import { ProjectsCaller } from '~/composables/api/share';
    import { BoarderRolePaginator } from '~/composables/api/boarderRole';

    const headers = [
        { title: '名稱', values: ['name'] },
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
    const recordsStore = useOptionsStore();
    const { selectedOptionType } = storeToRefs(recordsStore);

    const optionBoarderRoleEditPopUp = ref();
    const optionBoarderRoleDeletePopUp = ref();

    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;
    const boarderRolePaginator = new BoarderRolePaginator({ immediate: false });
    const { data: boarderRoleList } = boarderRolePaginator;
    
    boarderRolePaginator?.bind('project_id', toRef(values, 'selectedProjectId'));
    boarderRolePaginator.bind('search', toRef(values, 'search'));

    const queries = computed(() => ({
        recordType: selectedOptionType.value,
        ...boarderRolePaginator?.queries?.value,
    }));

    const stopHandler = queryStringInspecter(queries, { deep: true, immediate: true });

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRoute().query;

            setFieldValue('search', query?.search ? `${query?.search}` : '');

            boarderRolePaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
        });
    });

    onUnmounted(() => {
        stopHandler();
    });
</script>