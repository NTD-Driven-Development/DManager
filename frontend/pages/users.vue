<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 操作 -->
            <div class="flex flex-col gap-2 lg:flex-row">
                <UserCreate class="grow-[1] lg:basis-1"
                @on-created="userPaginator?.reload()"></UserCreate>
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    </div>
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <Input name="search" placeholder="搜尋姓名、學號、電子郵件" class="text-xs w-full rounded border"/>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="userList">
                    <template #姓名="{ data }">
                        <div class="px-2 py-1">
                            {{ checkValueEmpty(data?.name) }}
                        </div>
                    </template>
                    <template #學號="{ data }">{{ checkValueEmpty(data?.sid) }}</template>
                    <template #電子郵件="{ data }">{{ checkValueEmpty(data?.email) }}</template>
                    <template #備註="{ data }">
                        <div class="flex justify-center whitespace-pre-wrap break-all min-w-[180px] max-w-xs">
                            {{ checkValueEmpty(data?.remark) }}
                        </div>
                    </template>
                    <template #角色="{ data }">{{ checkValueEmpty(data?.roles, (v) => v?.map((v: any) => v?.name)?.join('、')) }}</template>
                    <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                    <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                    <template #操作="{ id, data }">
                        <div class="flex gap-2 text-base">
                            <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="userEditPopUp?.show(id)"></Icon>
                            <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" v-if="!data?.is_admin" @click="userDeletePopUp?.show(id)"></Icon>
                        </div>
                    </template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="userPaginator"></Paginator>
        </div>
        <UserEditPopUp ref="userEditPopUp" @on-edited="userPaginator?.reload()"></UserEditPopUp>
        <UserDeletePopUp ref="userDeletePopUp" @on-deleted="userPaginator?.reload()"></UserDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { UserPaginator } from '~/composables/api/user';
    import _ from 'lodash';

    const headers = [
        { title: '姓名', values: ['name'] },
        { title: '學號', values: ['sid'] },
        { title: '電子郵件', values: ['email'] },
        { title: '備註', values: ['remark'] },
        { title: '角色', values: ['roles'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: ['is_admin'] }
    ]

    const { setFieldValue, values } = useForm<{
        selectedProjectId?: number,
        search?: string,
    }>();

    const userEditPopUp = ref();
    const userDeletePopUp = ref();

    const userPaginator = new UserPaginator({ immediate: false, debounceTime: 500 });
    const { data: userList } = userPaginator;

    userPaginator?.bind('search', toRef(values, 'search'));

    queryStringInspecter(userPaginator?.queries);

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRouter().currentRoute.value.query;

            setFieldValue('search', query?.search ? `${query?.search}` : '');

            userPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
        });
    });
</script>