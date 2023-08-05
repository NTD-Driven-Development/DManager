<template>
    <div class="flex flex-col items-center gap-4 sm:gap-5 lg:gap-6">
        <div class="flex justify-between items-center w-72 h-10 px-3 shadow border rounded-lg bg-gray-50 sm:w-96 sm:px-4">
            <div class="flex gap-2">
                <FAIcon :icon="['fasr', 'angles-left']" class="cursor-pointer text-primary-blue-400"
                :class="{'invisible': !apiPaginator?.canPrev()}" @click="apiPaginator?.first()"/>
                <FAIcon :icon="['fasr', 'angle-left']" class="cursor-pointer text-primary-blue-400"
                :class="{'invisible': !apiPaginator?.canPrev()}" @click="apiPaginator?.prev()"/>
            </div>
            <div class="flex gap-3 text-xs sm:text-sm sm:gap-5">
                <div v-for="it in [2, 1]" :class="{'invisible': !apiPaginator?.canPrev(it)}" class="py-1 px-2 cursor-pointer"
                @click="apiPaginator?.prev(it)">{{ (apiPaginator?.paginate?.value?.currentPage ?? 0) - it }}</div>
                <div class="py-1 px-2 shadow-lg bg-gray-600 text-white cursor-pointer"
                :class="{'invisible': isNaN(apiPaginator?.paginate?.value?.currentPage ?? NaN)}">{{ apiPaginator?.paginate?.value?.currentPage }}</div>
                <div v-for="it in [1, 2]" :class="{'invisible': !apiPaginator?.canNext(it)}" class="py-1 px-2 cursor-pointer"
                @click="apiPaginator?.next(it)">{{ (apiPaginator?.paginate?.value?.currentPage ?? 0) + it }}</div>
            </div>
            <div class="flex gap-2">
                <FAIcon :icon="['fasr', 'angle-right']" class="cursor-pointer text-primary-blue-400"
                :class="{'invisible': !apiPaginator?.canNext()}" @click="apiPaginator?.next()"/>
                <FAIcon :icon="['fasr', 'angles-right']" class="cursor-pointer text-primary-blue-400"
                :class="{'invisible': !apiPaginator?.canNext()}" @click="apiPaginator?.last()"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T, Q extends PaginationQueries">
    import { ApiPaginator, PaginationQueries } from '~/core/api';

    interface Props {
        apiPaginator?: ApiPaginator<T, Q>,
    }

    defineProps<Props>();
</script>