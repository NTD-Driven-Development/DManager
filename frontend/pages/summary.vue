<template>
    <div class="fixed flex flex-col gap-3 p-3 sm:p-7 lg:gap-5 w-full min-w-full max-w-full h-full min-h-full max-h-full"
    @mousemove="onMouseMove">
        <!-- 選擇項目 -->
        <div class="flex flex-col gap-1" v-show="isSettingVisable">
            <div class="text-sm">選擇項目：</div>
            <Select name="selectedProjectId" class="shadow border text-xs"
            :options="projectList" option-key="id" option-value="name"></Select>
        </div>
        <!-- 內容 -->
        <div class="flex flex-col gap-3">

        </div>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { Icon } from '@iconify/vue';
    import { ProjectsCaller } from '~/composables/api/share';
    import _ from 'lodash';

    const { setFieldValue, values } = useForm<{ selectedProjectId?: number }>();

    const isSettingVisable = ref(false);
    let mouseMoveTimeout: NodeJS.Timeout;

    const projectsCaller = new ProjectsCaller()
    .success((v) => setFieldValue('selectedProjectId', v?.data?.[0]?.id));
    const { data: projectList } = projectsCaller;

    const onMouseMove = _.throttle(() => {
        clearTimeout(mouseMoveTimeout);
        isSettingVisable.value = true;
        mouseMoveTimeout = setTimeout(() => {
            isSettingVisable.value = false;
        }, 1000);
    }, 800);
</script>