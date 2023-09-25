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
                    input-class-name="!text-sm" :min-date="new Date()"
                    :format="(v: any[]) => v?.map((v) => format(v, 'yyyy-MM-dd'))?.join('、')"
                    @update:model-value="(v: any[]) => setFieldValue('dates', v?.map((v) => format(v, 'yyyy-MM-dd')))"
                    :model-value="values.dates" :enable-time-picker="false"></VueDatePicker>
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
    import { format, addDays } from 'date-fns';
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
            await Promise.all((data.dates as any[]).sort((v1, v2) => v1 > v2 ? 1 : 0).map((v: any) => createUserDuty({
                user_id: data?.user_id,
                start_time: v,
                end_time: format(addDays(new Date(v), 1), 'yyyy-MM-dd'),
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