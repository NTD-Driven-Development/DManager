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
                    <div class="flex flex-col justify-center w-full gap-0.5">
                        <div class="flex gap-0.5 shrink-0">
                            <span class="text-red-500">*</span>
                            <span>通話對象：</span>
                        </div>
                        <div class="flex-1 text-black text-xs">
                            <Select name="tel_card_contacter_id" placeholder="請選擇規則" class="w-full rounded border"
                            :options="telCardCotacterList" option-key="id" option-value="name"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span>通話日期：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <Input type="date" name="contacted_at" placeholder="請選擇通話日期" class="w-full rounded border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex gap-0.5 shrink-0">
                    <span>備註：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px] border"/>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex flex-col h-full w-full text-black text-xs">
                    <span>{{ `姓名：${checkValueEmpty(boarder?.name)}` }}</span>
                    <span>{{ `學號：${checkValueEmpty(boarder?.sid)}` }}</span>
                    <span>{{ `班級：${checkValueEmpty(boarder?.class?.name)}` }}</span>
                </div>
            </div>
        </form>
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增電話卡紀錄
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { BoardersCaller, TelCardContractersCaller } from '~/composables/api/share';
    import { createTelCardLog } from '~/composables/api/telCard';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Props {
        projectId: number,
    }

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        tel_card_contacter_id: yup.number().required(),
        contacted_at: yup.date().required(),
        remark: yup.string().nullable(),
    });

    const props = defineProps<Props>();

    const emits = defineEmits<Emits>();

    const { handleSubmit, values, setFieldValue } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);

    const boardersCaller = new BoardersCaller({ immediate: false });
    const telCardContractersCaller = new TelCardContractersCaller()
    .success((v) => setFieldValue('tel_card_contacter_id', v?.data?.[0]?.id));
    const { data: telCardCotacterList } = telCardContractersCaller;

    boardersCaller?.bind('project_id', toRef(props, 'projectId'), { immediate: !_.isNaN(props?.projectId) });

    const boarder = computed(() => {
        const bunk = toBunk(values?.bunk);
        const boaders = boardersCaller?.data?.value;

        if (!bunk) 
            return null;

        return boaders?.find(({ project_bunk: v }) => v?.floor == bunk?.floor && v?.room_type == bunk?.room_type && v?.room_no == bunk?.room_no && v?.bed == bunk?.bed);
    });

    const onSubmit = handleSubmit(async (data) => {
        try {            
            await createTelCardLog({
                project_id: props?.projectId,
                boarder_id: boarder?.value?.id!,
                tel_card_contacter_id: data?.tel_card_contacter_id,
                contacted_at: data?.contacted_at,
                remark: data?.remark,
            });
            
            toastNotifier?.success('新增成功');
            emits('onCreated');
            setFieldValue('bunk', undefined);
            setFieldValue('tel_card_contacter_id', telCardCotacterList?.value?.[0]?.id);
            setFieldValue('remark', undefined);
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>