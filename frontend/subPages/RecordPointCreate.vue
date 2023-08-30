<template>
    <div class="flex flex-col overflow-hidden rounded text-sm bg-white">
        <form class="flex flex-1 flex-col p-3 gap-1 border border-gray-300">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>樓寢床：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="bunk" placeholder="請輸入樓寢床" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>規則：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="point_rule_id" placeholder="請選擇規則" class="w-full rounded border"
                        :options="pointRuleList" option-key="id" :option-value="(v) => `${v?.code}.${v?.reason}`"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="reason" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
        </form>
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增加扣點紀錄
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { PointRulesCaller } from '~/composables/api/share';
    import { createBoarderStatus } from '~/composables/api/boarderStatus';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Props {
        projectId: number,
    }

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        name: yup.string().required(),
    });

    const props = defineProps<Props>();

    const emits = defineEmits<Emits>();

    const { handleSubmit, setFieldValue, resetForm } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const pointRulesCaller = new PointRulesCaller()
    .success((v) => setFieldValue('point_rule_id', v?.data?.[0]?.id));
    const { data: pointRuleList } = pointRulesCaller;

    const onSubmit = handleSubmit(async (data) => {
        try {            
            await createBoarderStatus({
                name: data?.name,
            });
            
            toastNotifier?.success('新增成功');
            emits('onCreated');
            resetForm();
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>