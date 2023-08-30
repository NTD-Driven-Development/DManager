<template>
    <div class="flex flex-col gap-3">
        <!-- 選擇項目 -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">選擇項目：</div>
            <Select name="selectedProjectId" class="shadow border text-xs"
            :options="projectList" option-key="id" option-value="name" ></Select>
        </div>
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionBoarderRoleCreate :project-id="values?.selectedProjectId!" class="grow-[1] max-w-sm lg:basis-1"
            @on-created="boarderRolePaginator?.reload()"></OptionBoarderRoleCreate>
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
                        {{ data?.name }}
                    </div>
                </template>
                <template #建立時間="{ data }">{{ toSimpleDate(data?.created_at) ?? '--' }}</template>
                <template #建立者="{ data }">{{ data?.created_by ?? '--' }}</template>
                <template #更新時間="{ data }">{{ toSimpleDate(data?.created_at) ?? '--' }}</template>
                <template #更新者="{ data }">{{ data?.created_by ?? '--' }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2">
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionBoarderRoleEditPopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="boarderRolePaginator"></Paginator>
        <OptionBoarderRoleEditPopUp ref="optionBoarderRoleEditPopUp"></OptionBoarderRoleEditPopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { ProjectsCaller } from '~/composables/api/share';
    import { BoarderRolePaginator } from '~/composables/api/boarderRole';

    const headers = [
        { title: '名稱', values: ['name'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['created_by'] },
        { title: '更新時間', values: ['created_at'] },
        { title: '更新者', values: ['created_by'] },
        { title: '操作', values: [] }
    ]

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number }>();

    const optionBoarderRoleEditPopUp = ref();

    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;
    const boarderRolePaginator = new BoarderRolePaginator({ immediate: false });
    const { data: boarderRoleList } = boarderRolePaginator;
    
    boarderRolePaginator?.bind('project_id', toRef(values, 'selectedProjectId'));
</script>