<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <div class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="text-base font-bold">確認刪除此筆資料？</div>
            <div class="flex flex-col">
                <div>{{ `床位：${checkValueEmpty(pointLog?.boarder?.project_bunk, (v) => toStringlish(v))}` }}</div>
                <div>{{ `姓名：${checkValueEmpty(pointLog?.boarder?.name)}` }}</div>
                <div>{{ `編號：${checkValueEmpty(pointLog?.point_rule?.code)}` }}</div>
                <div>{{ `事由：${checkValueEmpty(pointLog?.point_rule?.reason)}` }}</div>
                <div>{{ `點數：${checkValueEmpty(pointLog?.point)}` }}</div>
                <div class="whitespace-pre-wrap break-all">{{ `備註：${checkValueEmpty(pointLog?.remark)}` }}</div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-red-500" @click="onSubmit">
            確認並刪除
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { PointLogCaller, deletePointLog } from '~/composables/api/point';
    import _ from 'lodash';

    interface Emits {
        (e: 'onDeleted'): void;
    }
    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);

    const popUp = ref();
    const visible = ref(false);

    const pointLogCaller = new PointLogCaller();
    const { data: pointLog } = pointLogCaller;

    const onSubmit = async () => {
        try {
            const boader = pointLogCaller?.data?.value;

            await deletePointLog(boader?.id!);

            toastNotifier?.success('刪除成功');
            emits('onDeleted');
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    };

    const show = async (pointLogId: number) => {
        pointLogCaller.id = pointLogId;
        pointLogCaller?.reload();

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>