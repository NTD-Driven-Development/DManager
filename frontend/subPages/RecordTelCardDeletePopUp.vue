<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] max-h-[80%] text-sm bg-white rounded">
        <div class="flex w-full flex-col p-3 gap-2 overflow-auto lg:p-5">
            <div class="text-base font-bold">確認刪除此筆資料？</div>
            <div class="flex flex-col">
                <div>{{ `床位：${checkValueEmpty(telCardLog?.boarder?.project_bunk, (v) => toStringlish(v))}` }}</div>
                <div>{{ `姓名：${checkValueEmpty(telCardLog?.boarder?.name)}` }}</div>
                <div>{{ `通話對象：${checkValueEmpty(telCardLog?.tel_card_contacter?.name)}` }}</div>
                <div>{{ `備註：${checkValueEmpty(telCardLog?.remark)}` }}</div>
                <div>{{ `通話時間：${checkValueEmpty(telCardLog?.contacted_at, (v) => format(new Date(v), 'yyyy-MM-dd'))}` }}</div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-red-500" @click="onSubmit">
            確認並刪除
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { format } from 'date-fns';
    import { TelCardLogCaller, deleteTelCardLog } from '~/composables/api/telCard';
    import _ from 'lodash';

    interface Emits {
        (e: 'onDeleted'): void;
    }
    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);

    const popUp = ref();
    const visible = ref(false);

    const telCardLogCaller = new TelCardLogCaller();
    const { data: telCardLog } = telCardLogCaller;

    const onSubmit = async () => {
        try {
            const boader = telCardLogCaller?.data?.value;

            await deleteTelCardLog(boader?.id!);

            toastNotifier?.success('刪除成功');
            emits('onDeleted');
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    };

    const show = async (telCardLogId: number) => {
        telCardLogCaller.id = telCardLogId;
        telCardLogCaller?.reload();

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>