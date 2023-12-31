<template>
    <div class="flex flex-col overflow-hidden rounded text-sm bg-white">
        <form class="flex flex-1 flex-col p-3 gap-1 border border-gray-300">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>樓寢床或門禁卡號
                            ：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="bunk" autocomplete="off" placeholder="請輸入樓寢床或門禁卡號" class="w-full rounded border"/>
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
                    <span class="text-red-500">*</span>
                    <span>通話日期：</span>
                </div>
                <div class="h-full w-full text-black text-xs">
                    <VueDatePicker menu-class-name="fixed z-20" locale="zh-TW"
                    input-class-name="!text-xs h-[38px] placeholder:text-gray-500" :min-date="addDays(new Date(), -14)" placeholder="請選擇通話日期"
                    :format="(v: any) => v && format(v, 'yyyy-MM-dd')"
                    @update:model-value="(v: any) => v && setFieldValue('contacted_at', format(v, 'yyyy-MM-dd'))"
                    :model-value="values.contacted_at" :enable-time-picker="false"></VueDatePicker>
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
    import { format, addDays } from 'date-fns';
    import { BoardersCaller, TelCardContractersCaller } from '~/composables/api/share';
    import { createTelCardLog } from '~/composables/api/telCard';
    import * as yup from 'yup';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import _ from 'lodash';
    import '@vuepic/vue-datepicker/dist/main.css';

    interface Props {
        projectId: number,
    }

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        bunk: yup.string().required(),
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
        const bunkOrAccessCard = toBunk(values?.bunk) ?? values?.bunk;
        const boaders = boardersCaller?.data?.value;

        if (!bunkOrAccessCard) 
            return null;

        return boaders?.find(({ project_bunk: v, access_card }) => 
            (v?.floor == bunkOrAccessCard?.floor && v?.room_type == bunkOrAccessCard?.room_type && v?.room_no == bunkOrAccessCard?.room_no && v?.bed == bunkOrAccessCard?.bed)
            || (bunkOrAccessCard == access_card)
        );
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
            setFieldValue('contacted_at', undefined);
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>