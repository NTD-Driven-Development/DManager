<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <RecordPointCreate :project-id="props?.projectId" class="grow-[1] lg:basis-1"
            @on-created="pointLogPaginator?.reload()"></RecordPointCreate>
            <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
            </div>
        </div>
        <!-- 搜尋 -->
        <div class="w-full lg:w-64">
            <Input name="search" placeholder="搜尋樓寢床、姓名" class="text-xs w-full rounded border"/>
        </div>
        <!-- 列表 -->
        <div class="w-full overflow-auto bg-white">
            <OrderTable id="id" :headers="headers" :rows="pointLogList">
                <template #樓寢床="{ data }">
                    <div class="px-2 py-1">
                        {{ checkValueEmpty(data?.boarder?.project_bunk, (v) => toStringlish(v)) }}
                    </div>
                </template>
                <template #姓名="{ data }">{{ checkValueEmpty(data?.boarder?.name) }}</template>
                <template #編號="{ data }">{{ checkValueEmpty(data?.point_rule?.code) }}</template>
                <template #事由="{ data }">
                    <div class="whitespace-pre-wrap break-all min-w-[200px]">
                        {{ checkValueEmpty(data?.point_rule?.reason) }}
                    </div>
                </template>
                <template #點數="{ data }">{{ checkValueEmpty(data?.point) }}</template>
                <template #備註="{ data }">
                    <div class="flex justify-center whitespace-pre-wrap break-all min-w-[200px] max-w-xs">
                        {{ checkValueEmpty(data?.remark) }}
                    </div>
                </template>
                <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2 text-base">
                        <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="recordPointDeletePopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="pointLogPaginator"></Paginator>
        <RecordPointDeletePopUp ref="recordPointDeletePopUp" @on-deleted="pointLogPaginator?.reload()"></RecordPointDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { useRecordsStore } from '~/stores/records';
    import { PointLogPaginator } from '~/composables/api/point';
    import _ from 'lodash';
    
    interface Props {
        projectId: number,
    }

    const headers = [
        { title: '樓寢床', values: ['boarder'] },
        { title: '姓名', values: ['boarder'] },
        { title: '編號', values: ['point_rule'] },
        { title: '事由', values: ['point_rule'] },
        { title: '點數', values: ['point'] },
        { title: '備註', values: ['remark'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '操作', values: [] }
    ]

    const props = defineProps<Props>();

    const { setFieldValue, values } = useForm<{
        search?: string,
    }>();
    const recordsStore = useRecordsStore();
    const { selectedRecordType } = storeToRefs(recordsStore);

    const recordPointDeletePopUp = ref();

    const pointLogPaginator = new PointLogPaginator({ immediate: false });
    const { data: pointLogList } = pointLogPaginator;

    pointLogPaginator?.bind('project_id', toRef(props, 'projectId'), { immediate: !_.isNaN(props?.projectId) });
    pointLogPaginator.bind('search', toRef(values, 'search'));

    const queries = computed(() => ({
        recordType: selectedRecordType.value,
        ...pointLogPaginator?.queries?.value,
    }));

    const stopHandler = queryStringInspecter(queries, { deep: true, immediate: true });

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRouter().currentRoute.value.query;

            setFieldValue('search', query?.search ? `${query?.search}` : '');

            console.log(query?.offset ? +query?.offset : 1);
            
            pointLogPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
        });
    });

    onUnmounted(() => {
        stopHandler();
    });
</script>