<template>
    <Title>{{ `操作記錄 - Dormiday` }}</Title>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <Input name="search" placeholder="搜尋使用者ID、使用者名稱、操作名稱" class="text-xs w-full rounded border"/>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="logList">
                    <template #使用者ID="{ data }">
                        <div class="px-2 py-1">
                            {{ checkValueEmpty(data?.user_id) }}
                        </div>
                    </template>
                    <template #使用者名稱="{ data }">{{ checkValueEmpty(data?.user_name) }}</template>
                    <template #操作名稱="{ data }">{{ checkValueEmpty(data?.operation_name) }}</template>
                    <template #敘述="{ data }">
                        <div class="flex whitespace-pre-wrap break-all min-w-[300px] max-w-[300px]">
                            {{ checkValueEmpty(parseOperationLogDetail(data)) }}
                        </div>
                    </template>
                    <template #操作時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="logPaginator"></Paginator>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { format } from 'date-fns';
    import { LogPaginator, parseOperationLogDetail } from '~/composables/api/log';
    import _ from 'lodash';

    const headers = [
        { title: '使用者ID', values: ['user_id'] },
        { title: '使用者名稱', values: ['user_name'] },
        { title: '操作名稱', values: ['operation_name'] },
        { title: '敘述', values: ['url', 'http_method', 'user_id', 'user_name', 'body', 'detail'] },
        { title: '操作時間', values: ['created_at'] },
    ]

    const { setFieldValue, values } = useForm<{
        search?: string,
    }>();

    const logPaginator = new LogPaginator({ immediate: false });
    const { data: logList } = logPaginator;

    logPaginator.bind('search', toRef(values, 'search'));

    queryStringInspecter(logPaginator.queries);

    onMounted(() => {
        Promise.all([])
        .then(async () => {
            const query = useRouter().currentRoute?.value?.query;

            logPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
            logPaginator.withQuery('search', query?.search ? `${query?.search}` : '');

            setFieldValue('search', query?.search ? `${query?.search}` : '');
        });
    });
</script>
