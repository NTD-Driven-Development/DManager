<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-2/5 max-w-[80%] bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-4 gap-2 lg:p-6 overflow-auto">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-sm">
                        <span class="text-red-500">*</span>
                        <span>編號：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="code" placeholder="請輸入編號" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0 text-sm">
                        <span class="text-red-500">*</span>
                        <span>點數：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="point" placeholder="請輸入點數" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0 text-sm">
                    <span class="text-red-500">*</span>
                    <span>事由：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="reason" placeholder="請輸入事由" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-600" @click="onSubmit">
            儲存
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { PointRuleCaller, updatePointRule } from '~/composables/api/point';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onEdited'): void;
    }

    const schema = yup.object().shape({
        code: yup.string().required(),
        reason: yup.string().required(),
        point: yup.string().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);

    const pointRuleCaller = new PointRuleCaller();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const pointRule = pointRuleCaller?.data?.value;

            await updatePointRule({
                id: pointRule?.id!,
                code: data?.code,
                reason: data?.reason,
                point: data?.point,
            });

            toastNotifier?.success('儲存成功');
            emits('onEdited');
            close();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const show = async (pointRuleId: number) => {
        pointRuleCaller.id = pointRuleId;
        pointRuleCaller?.reload();

        await pointRuleCaller?.wait();
        const pointRule = pointRuleCaller?.data?.value;

        setFieldValue('code', pointRule?.code);
        setFieldValue('reason', pointRule?.reason);
        setFieldValue('point', pointRule?.point);

        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>