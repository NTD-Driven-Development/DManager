<template>
    <div class="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6">
        <div class="flex justify-between items-center w-72 h-10 px-3 shadow border rounded-lg bg-white sm:w-96 sm:px-4">
            <div class="flex gap-2">
                <Icon icon="ic:round-keyboard-double-arrow-left" class="cursor-pointer w-5 h-5"
                :class="{'invisible': !apiPaginator?.canPrev()}" @click="apiPaginator?.first()"/>
                <Icon icon="ic:round-keyboard-arrow-left" class="cursor-pointer w-5 h-5"
                :class="{'invisible': !apiPaginator?.canPrev()}" @click="apiPaginator?.prev()"/>
            </div>
            <div class="flex gap-3 text-xs sm:text-sm sm:gap-5">
                <div v-for="it in [2, 1]" :class="{'invisible': !apiPaginator?.canPrev(it)}" class="py-1 px-2 cursor-pointer"
                @click="apiPaginator?.prev(it)">{{ (apiPaginator?.paginate?.value?.currentPage ?? 0) - it }}</div>
                <div class="py-1 px-2 shadow-lg rounded bg-gray-600 text-white cursor-pointer"
                :class="{'invisible': isNaN(apiPaginator?.paginate?.value?.currentPage ?? NaN)}">{{ apiPaginator?.paginate?.value?.currentPage }}</div>
                <div v-for="it in [1, 2]" :class="{'invisible': !apiPaginator?.canNext(it)}" class="py-1 px-2 cursor-pointer"
                @click="apiPaginator?.next(it)">{{ (apiPaginator?.paginate?.value?.currentPage ?? 0) + it }}</div>
            </div>
            <div class="flex gap-2">
                <Icon icon="ic:round-keyboard-arrow-right" class="cursor-pointer w-5 h-5"
                :class="{'invisible': !apiPaginator?.canNext()}" @click="apiPaginator?.next()"/>
                <Icon icon="ic:round-keyboard-double-arrow-right" class="cursor-pointer w-5 h-5"
                :class="{'invisible': !apiPaginator?.canNext()}" @click="apiPaginator?.last()"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Icon } from '@iconify/vue';
    import { ApiPaginator } from '~/core/api';

    interface Props {
        apiPaginator?: ApiPaginator,
    }

    defineProps<Props>();
</script>