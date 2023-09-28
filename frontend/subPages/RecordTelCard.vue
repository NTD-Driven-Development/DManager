<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <RecordTelCardCreate :project-id="props?.projectId" class="grow-[1] lg:basis-1"
            @on-created="telCardLogPaginator?.reload()"
            v-if="authStore?.hasAnyRole([UserRole.Editor])"></RecordTelCardCreate>
            <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5"
            v-if="false">
            </div>
        </div>
        <!-- 搜尋 -->
        <div class="w-full lg:w-64">
            <Input name="search" placeholder="搜尋樓寢床、姓名" class="text-xs w-full rounded border"/>
        </div>
        <!-- 列表 -->
        <div class="w-full overflow-auto bg-white">
            <OrderTable id="id" :headers="headers" :rows="telCardLogList">
                <template #樓寢床="{ data }">
                    <div class="px-2 py-1">
                        {{ checkValueEmpty(data?.boarder?.project_bunk, (v) => toStringlish(v)) }}
                    </div>
                </template>
                <template #姓名="{ data }">{{ checkValueEmpty(data?.boarder?.name) }}</template>
                <template #通話對象="{ data }">{{ checkValueEmpty(data?.tel_card_contacter?.name) }}</template>
                <template #備註="{ data }">
                    <div class="flex justify-center whitespace-pre-wrap break-all min-w-[200px] max-w-xs">
                        {{ checkValueEmpty(data?.remark) }}
                    </div>
                </template>
                <template #通話時間="{ data }">{{ checkValueEmpty(data?.contacted_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                <template #操作="{ id }">
                    <div class="flex gap-2 text-base">
                        <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="recordTelCardDeletePopUp?.show(id)"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="telCardLogPaginator"></Paginator>
        <RecordTelCardDeletePopUp ref="recordTelCardDeletePopUp" @on-deleted="telCardLogPaginator?.reload()"></RecordTelCardDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { useAuthStore } from '~/stores/auth';
    import { useRecordsStore } from '~/stores/records';
    import { TelCardLogPaginator } from '~/composables/api/telCard';
    import _ from 'lodash';

    interface Props {
        projectId: number,
    }

    const headers = [
        { title: '樓寢床', values: ['boarder'] },
        { title: '姓名', values: ['boarder'] },
        { title: '通話對象', values: ['tel_card_contacter'] },
        { title: '備註', values: ['remark'] },
        { title: '通話時間', values: ['contacted_at'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '操作', values: [] }
    ]

    const props = defineProps<Props>();

    const { setFieldValue, values } = useForm<{
        search?: string,
    }>();
    const authStore = useAuthStore();
    const recordsStore = useRecordsStore();
    const { selectedRecordType } = storeToRefs(recordsStore);

    const recordTelCardDeletePopUp = ref();

    const telCardLogPaginator = new TelCardLogPaginator({ immediate: false, debounceTime: 500 });
    const { data: telCardLogList } = telCardLogPaginator;

    const queries = computed(() => ({
        recordType: selectedRecordType.value,
        ...telCardLogPaginator?.queries?.value,
    }));

    telCardLogPaginator?.bind('project_id', toRef(props, 'projectId'), { immediate: !_.isNaN(props?.projectId) });
    telCardLogPaginator.bind('search', toRef(values, 'search'));

    const stopHandler = queryStringInspecter(queries, { deep: true, immediate: true });

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRouter().currentRoute.value.query;

            setFieldValue('search', query?.search ? `${query?.search}` : '');

            telCardLogPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
        });
    });

    onUnmounted(() => {
        stopHandler();
    });
</script>