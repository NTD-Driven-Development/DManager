<template>
    <Title>{{ `輪值管理 - Dormiday` }}</Title>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 內容 -->
        <div class="flex flex-col gap-3">
            <!-- 操作 -->
            <div class="flex flex-col gap-2 lg:flex-row">
                <UserDutyCreate class="grow-[1] lg:basis-1"
                @on-created="userDutyPaginator?.reload()"
                v-if="authStore?.hasAnyRole([UserRole.Editor])"></UserDutyCreate>
                <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5"
                v-if="false">
                </div>
            </div>
            <!-- 搜尋 -->
            <div class="w-full lg:w-64">
                <Input name="search" placeholder="搜尋姓名" class="text-xs w-full rounded border"/>
            </div>
            <div>
                <VueDatePicker multi-dates menu-class-name="fixed z-20" locale="zh-TW"
                    input-class-name="!text-xs h-[38px] placeholder:text-gray-500" placeholder="篩選輪值日"
                    :format="(v: any[]) => v?.map((v) => format(v, 'yyyy-MM-dd'))?.join('、')"
                    @update:model-value="(v: any[]) => setFieldValue('start_times', v?.map((v) => format(set(new Date(v), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), `yyyy-MM-dd'T'HH:mm:ssXXX`)))"
                    :model-value="values?.start_times" :enable-time-picker="false"></VueDatePicker>
            </div>
             <!-- 列表 -->
            <div class="w-full overflow-auto bg-white">
                <OrderTable id="id" :headers="headers" :rows="userDutyList">
                    <template #姓名="{ data }">
                        <div class="px-2 py-1">
                            {{ checkValueEmpty(data?.user?.name) }}
                        </div>
                    </template>
                    <template #輪值起="{ data }">{{ checkValueEmpty(data?.start_time, (v) => format(addHours(parseISO(v), -8), 'yyyy-MM-dd HH:mm')) }}</template>
                    <template #輪值迄="{ data }">{{ checkValueEmpty(data?.end_time, (v) => format(addHours(parseISO(v), -8), 'yyyy-MM-dd hh:mm')) }}</template>
                    <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                    <template #更新時間="{ data }">{{ checkValueEmpty(data?.updated_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                    <template #更新者="{ data }">{{ checkValueEmpty(data?.updater?.name) }}</template>
                    <template #操作="{ id }">
                        <div class="flex gap-2 text-base">
                            <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="userDutyDeletePopUp?.show(id)"
                            v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                        </div>
                    </template>
                </OrderTable>
            </div>
            <Paginator :api-paginator="userDutyPaginator"></Paginator>
        </div>
        <UserDutyDeletePopUp ref="userDutyDeletePopUp" @on-deleted="userDutyPaginator?.reload()"></UserDutyDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format, set, parseISO, addHours } from 'date-fns';
    import { useAuthStore } from '~/stores/auth';
    import { UserDutyPaginator } from '~/composables/api/user';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import _ from 'lodash';
    import '@vuepic/vue-datepicker/dist/main.css';

    const headers = [
        { title: '姓名', values: ['user'] },
        { title: '輪值起', values: ['start_time'] },
        { title: '輪值迄', values: ['end_time'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: [] }
    ]

    const { setFieldValue, values } = useForm<{
        search?: string,
        start_times?: string[],
    }>();
    const authStore = useAuthStore();

    const userDutyDeletePopUp = ref();

    const userDutyPaginator = new UserDutyPaginator({ immediate: false });
    const { data: userDutyList } = userDutyPaginator;
    
    userDutyPaginator?.bind('search', toRef(values, 'search'));
    userDutyPaginator?.bind('start_times', toRef(values, 'start_times'));

    queryStringInspecter(userDutyPaginator?.queries);

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRouter().currentRoute?.value?.query;

            userDutyPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
            userDutyPaginator.withQuery('search', query?.search ? `${query?.search}` : '');
            userDutyPaginator.withQuery('start_times', query?.start_times ? `${query?.start_times}`.split(',').map((v) => format(new Date(v), 'yyyy-MM-dd')) : undefined);

            setFieldValue('search', query?.search ? `${query?.search}` : '');
            setFieldValue('start_times', query?.start_times ? `${query?.start_times}`.split(',').map((v) => format(new Date(v), 'yyyy-MM-dd')) : undefined);
        });
    });
</script>