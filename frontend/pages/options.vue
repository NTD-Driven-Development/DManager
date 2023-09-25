<template>
    <div class="flex flex-col min-h-full gap-2 p-3 sm:p-7 lg:py-10 bg-gray-50">
        <!-- 選擇選項種類 -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">選擇選單種類：</div>
            <Select name="selectedOptionType" class="shadow border text-xs"
            :options="optionTypeList" option-key="id" option-value="name" :init-value="0"></Select>
        </div>
        <!-- 列表 -->
        <component :is="componentList[values?.selectedOptionType ?? 0]"></component>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import _ from 'lodash';
    import OptionBoarderStatus from '~/subPages/OptionBoarderStatus.vue';
    import OptionBoarderRole from '~/subPages/OptionBoarderRole.vue';
    import OptionClass from '~/subPages/OptionClass.vue';
    import OptionPointRule from '~/subPages/OptionPointRule.vue';
    import OptionTelCardContacter from '~/subPages/OptionTelCardContacter.vue';

    const optionTypeList = [
        { id: 0, name: '住宿生狀態' },
        { id: 1, name: '住宿生身分別' },
        { id: 2, name: '班級' },
        { id: 3, name: '加扣點規則' },
        { id: 4, name: '電話卡聯絡人' },
    ]
    const componentList = [
        OptionBoarderStatus,
        OptionBoarderRole,
        OptionClass,
        OptionPointRule,
        OptionTelCardContacter,
    ]

    const { values } = useForm<{ selectedOptionType?: number }>();
</script>