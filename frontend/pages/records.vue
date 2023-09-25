<template>
    <div class="flex flex-col min-h-full gap-3 p-3 sm:p-7 lg:py-10 lg:gap-5 bg-gray-50">
        <!-- Tabs -->
        <div class="flex flex-col w-full gap-5 sm:gap-7 lg:gap-8 bg-white">
            <div class="flex h-10 sm:h-12 lg:h-14 shadow-[0_3px_10px_rgba(0,0,0,0.25)]">
                <div class="relative flex flex-col flex-1 items-center justify-center">
                    <button class="flex items-center justify-center w-full h-full text-xs sm:text-sm"
                    @click="selectedRecordType = 0">加扣點</button>
                    <div class="absolute bottom-0 h-1 w-full transition-all duration-500" :class="$route.query?.recordType == '0' ? 'bg-gray-600' : 'bg-white'"></div>
                </div>
                <div class="relative flex flex-col flex-1 items-center justify-center">
                    <button class="flex items-center justify-center w-full h-full text-xs sm:text-sm"
                    @click="selectedRecordType = 1">電話卡</button>
                    <div class="absolute bottom-0 h-1 w-full transition-all duration-500" :class="$route.query?.recordType == '1' ? 'bg-gray-600' : 'bg-white'"></div>
                </div>
            </div>
        </div>
        <!-- 選擇項目 -->
        <div class="flex flex-col gap-1">
            <div class="text-sm">選擇項目：</div>
            <Select name="selectedProjectId" class="shadow border text-xs"
            :options="projectList" option-key="id" option-value="name" ></Select>
        </div>
        <!-- 內容 -->
        <component :is="componentList[selectedRecordType]" :project-id="values?.selectedProjectId ?? NaN"></component>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { ProjectsCaller } from '~/composables/api/share';
    import RecordPoint from '~/subPages/RecordPoint.vue';
    import RecordTelCard from '~/subPages/RecordTelCard.vue';

    const componentList = [
        RecordPoint,
        RecordTelCard,
    ]

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number }>();

    const selectedRecordType = ref(0);
    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;

    const queries = computed(() => {
        const v1 = selectedRecordType?.value;

        return {
            recordType: v1,
        }
    });

    queryStringInspecter(queries, { immediate: true });
</script>