<template>
    <div class="flex flex-col gap-3">
        <!-- 操作 -->
        <div class="flex flex-col gap-2 lg:flex-row">
            <OptionTelCardContacterCreate class="grow-[1] lg:basis-1"
            @on-created="telCardContacterPaginator?.reload()"
            v-if="authStore?.hasAnyRole([UserRole.Editor])"></OptionTelCardContacterCreate>
            <div class="flex flex-col grow-[1] bg-white h-auto border border-gray-300 rounded p-3 gap-3 text-sm lg:basis-1 lg:p-5"
            v-if="false">
            </div>
        </div>
        <!-- 搜尋 -->
        <div class="w-full lg:w-64 border">
            <Input name="search" placeholder="搜尋名稱" class="text-xs w-full rounded"/>
        </div>
        <!-- 列表 -->
        <div class="w-full overflow-auto bg-white">
            <OrderTable id="id" :headers="headers" :rows="TelCardContacterList">
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
                        <Icon icon="ic:round-mode-edit" class="cursor-pointer" @click="optionTelCardContacterEditPopUp?.show(id)"
                        v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                        <Icon icon="ic:round-delete" class="cursor-pointer text-red-600" @click="optionTelCardContacterDeletePopUp?.show(id)"
                        v-if="authStore?.hasAnyRole([UserRole.Editor])"></Icon>
                    </div>
                </template>
            </OrderTable>
        </div>
        <Paginator :api-paginator="telCardContacterPaginator"></Paginator>
        <OptionTelCardContacterEditPopUp ref="optionTelCardContacterEditPopUp" @on-edited="telCardContacterPaginator?.reload()"></OptionTelCardContacterEditPopUp>
        <OptionTelCardContacterDeletePopUp ref="optionTelCardContacterDeletePopUp" @on-deleted="telCardContacterPaginator?.reload()"></OptionTelCardContacterDeletePopUp>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { format } from 'date-fns';
    import { useAuthStore } from '~/stores/auth';
    import { useOptionsStore } from '~/stores/options';
    import { TelCardContacterPaginator } from '~/composables/api/telCard';

    const headers = [
        { title: '名稱', values: ['name'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
        { title: '更新時間', values: ['updated_at'] },
        { title: '更新者', values: ['updater'] },
        { title: '操作', values: [] }
    ]

    const { setFieldValue, values } = useForm<{
        search?: string,
    }>();
    const authStore = useAuthStore();
    const recordsStore = useOptionsStore();
    const { selectedOptionType } = storeToRefs(recordsStore);

    const optionTelCardContacterEditPopUp = ref();
    const optionTelCardContacterDeletePopUp = ref();

    const telCardContacterPaginator = new TelCardContacterPaginator({ immediate: false });
    const { data: TelCardContacterList } = telCardContacterPaginator;

    telCardContacterPaginator.bind('search', toRef(values, 'search'));

    const queries = computed(() => ({
        recordType: selectedOptionType.value,
        ...telCardContacterPaginator?.queries?.value,
    }));

    const stopHandler = queryStringInspecter(queries, { deep: true, immediate: true });

    onMounted(() => {
        Promise.all([])
        .then(() => {
            const query = useRouter().currentRoute?.value?.query;

            setFieldValue('search', query?.search ? `${query?.search}` : '');

            telCardContacterPaginator.withQuery('offset', query?.offset ? +query?.offset : 1);
        });
    });

    onUnmounted(() => {
        stopHandler();
    });
</script>