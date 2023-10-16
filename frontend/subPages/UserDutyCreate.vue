<template>
    <div class="flex flex-col overflow-hidden rounded text-sm bg-white">
        <form class="flex flex-1 flex-col p-3 gap-2 border border-gray-300 lg:p-5">
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>成員：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Select name="user_id" placeholder="請選擇成員" class="w-full rounded border"
                        :options="authUser?.is_admin ? userList : ([{ id: authUser?.id!, name: authUser?.name! }] as User[])" option-key="id" option-value="name"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span class="text-red-500">*</span>
                        <span>輪值日：</span>
                    </div>
                    <VueDatePicker multi-dates menu-class-name="fixed z-20" locale="zh-TW"
                    input-class-name="!text-xs placeholder:text-gray-500 h-[38px]" :min-date="new Date()" placeholder="選擇輪值日"
                    :format="(v: any[]) => v?.map((v) => format(v, 'yyyy-MM-dd'))?.join('、')"
                    @update:model-value="(v: any[]) => setFieldValue('dates', v?.map((v) => format(v, 'yyyy-MM-dd')))"
                    :model-value="values.dates" :enable-time-picker="false"></VueDatePicker>
                </div>
            </div>
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span>單日起始點：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="start" placeholder="請輸入單日起始點(0, 預設起始於當日0點)" class="w-full rounded border"/>
                    </div>
                </div>
                <div class="flex flex-col justify-center w-full gap-0.5">
                    <div class="flex gap-0.5 shrink-0">
                        <span>單日持續：</span>
                    </div>
                    <div class="flex-1 text-black text-xs">
                        <Input name="duration" placeholder="請輸入單日持續(1440, 預設持續1440分鐘)" class="w-full rounded border"/>
                    </div>
                </div>
            </div>
        </form>
        <button class="flex items-center justify-center p-2 bg-gray-600 text-white" @click="onSubmit">
            新增輪值
        </button>
    </div>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { format, addMinutes } from 'date-fns';
    import { useAuthStore } from '~/stores/auth';
    import { UsersCaller } from '~/composables/api/share';
    import { createUserDuty } from '~/composables/api/user';
    import * as yup from 'yup';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import _ from 'lodash';
    import '@vuepic/vue-datepicker/dist/main.css';

    interface Emits {
        (e: 'onCreated'): void,
    }

    const schema = yup.object().shape({
        user_id: yup.number().required(),
        dates: yup.array(yup.string()).required(),
        start: yup.number().transform((_, val) => val === Number(val) ? val : null) .nullable(),
        duration: yup.number().transform((_, val) => val === Number(val) ? val : null) .nullable(),
    });

    const emits = defineEmits<Emits>();

    const { handleSubmit, values, setFieldValue } = useForm({ validationSchema: schema });
    const toastNotifier = inject(ToastNotifierKey);
    const authStore = useAuthStore();
    const { authUser } = storeToRefs(authStore);

    const usersCaller = new UsersCaller()
    .success((v) => setFieldValue('user_id', v?.data?.[0]?.id));
    const { data: userList } = usersCaller;

    onMounted(async () => {
        Promise.all([
            usersCaller?.wait(),
        ])
        .then(() => {
            setFieldValue('user_id', authUser?.value?.is_admin ? userList?.value?.[0]?.id : authUser?.value?.id);
        })
        .catch((error) => showParseError(toastNotifier, error));
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log(data);
            
            await Promise.all((data.dates as any[]).sort((v1, v2) => v1 > v2 ? 1 : 0).map((v: any) => createUserDuty({
                user_id: data?.user_id,
                start_time: addMinutes(new Date(v), +checkValueEmpty(data?.start, undefined, '0')).toISOString(),
                end_time: addMinutes(new Date(v), +checkValueEmpty(data?.start, undefined, '0') + +checkValueEmpty(data?.duration, undefined, '1440')).toISOString(),
            })));

            toastNotifier?.success('新增成功');
            emits('onCreated');
            setFieldValue('dates', undefined);
        }
        catch(error) {
            showParseError(toastNotifier, error);
        }
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });
</script>