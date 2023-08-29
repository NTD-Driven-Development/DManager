<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- 選擇 -->
        <Select name="selectedOptionType" class="shadow border text-xs"
        :options="optionTypeList" option-key="id" option-value="name" :init-value="0"></Select>
        <!-- 列表 -->
        <component :is="componentList[values?.selectedOptionType ?? 0]"></component>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import _ from 'lodash';
    import OptionBoarderStatus from '~/subPages/OptionBoarderStatus.vue';

    const optionTypeList = [
        { id: 0, name: '住宿生狀態' },
        { id: 1, name: '住宿生身份別' },
        { id: 2, name: '班級' },
        { id: 3, name: '加扣點規則' },
        { id: 4, name: '電話卡聯絡人' },
    ]
    const componentList = [
        OptionBoarderStatus,
    ]

    const { values } = useForm<{ selectedOptionType?: number }>();
</script>