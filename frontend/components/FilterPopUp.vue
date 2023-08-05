<template>
    <PopUp ref="popUp" :containerClass="containerClass" :onBeforeClose="onBeforeClose">
        <slot :searchItems="searchItems" :updateItems="updateItems"
        :search="search" :toggle="toggle" :filterWith="filterWith" :close="close" :confirm="confirm"></slot>
    </PopUp>
</template>

<script setup lang="ts" generic="T">
    import { Filter } from '~/core/filter';

    interface Props {
        containerClass: string,
        filter: Filter<T>,
    }
    
    const { filter } = defineProps<Props>();

    const popUp = ref();
    const visible = ref(false);
    const filterExpression = ref();
    const updateItems = ref([]) as Ref<T[]>;

    const searchItems = computed(() => {
        if (filterExpression.value) return filter?.source.value?.filter(filterExpression.value);
        return filter?.source.value;
    });

    const search = (expression: (v: T) => boolean) => filterExpression.value = expression;

    const toggle = (value: T) => {
        if (!visible.value) return;
        if (!value) return;

        const existIndex = updateItems.value.findIndex((it) => it == value);
        const target = filter.source.value?.find((it) => it == value);
        if (existIndex != -1) 
            updateItems.value.splice(existIndex, 1);
        else if (target)
            updateItems.value.push(target);
        else
            throw Error('can not find target value.');
    };

    const filterWith = (expression: (v: T) => boolean) => {
        if (!visible.value) return;
        if (!expression) return;

        const filterItems = filter.source.value?.filter(expression);

        if (!filterItems) return;

        updateItems.value = filterItems;
    };

    const confirm = () => {
        filter?.filterWith((it) => updateItems.value.includes(it));
        popUp.value?.close();
        visible.value = false;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    const show = () => {
        updateItems.value = Array.from(filter.filterItems.value);
        popUp.value?.show();
        visible.value = true;
    };

    const onBeforeClose = () => {
        updateItems.value = [];
    };
    
    defineExpose({ show, close });
</script>