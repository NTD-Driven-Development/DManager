<template>
    <PopUp ref="popUp" container-class="flex flex-col overflow-auto items-center w-full h-4/5 max-w-[80%] bg-white rounded">
        <div class="flex-1 flex flex-col w-full p-3 gap-2 lg:p-5 overflow-auto">
            <div class="flex flex-col p-2 gap-1 border shadow text-sm">
                <div class="flex flex-col">
                    <div>
                        <span>1. 僅供匯入CSV檔，內容依欄位名稱（ </span>
                        <b class="text-red-500">{{ columnSchema?.map((v) => v?.key)?.join('、') }}</b>
                        <span> ）自動識別並填入</span>
                    </div>
                    <div>
                        <span>2. </span>
                        <b class="text-red-500">{{ columnSchema?.filter((v) => v?.require)?.map((v) => v?.key)?.join('、') }}</b>
                        <span> 為必填欄位，其餘為非必填，必填欄位若缺少任一資料，將視為空床位（ 即不會匯入 ）</span>
                    </div>
                    <div>
                        <span>3. 如有多重身分別，請務必使用全形頓號（ </span>
                        <b class="text-red-500">、</b>
                        <span> ）做串接，身分別會自動建立，每個項目需維護自身的身分別</span>
                    </div>
                    <div>
                        <span>4. 班級將自動匹配現有選項，若無匹配任一值，將另作提示並自動建立</span>
                    </div>
                    <div>
                        <span>5. 匯入功能不支援欄位編輯，如需更改，請直接編輯CSV檔內容，再行上傳</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-4 items-center lg:flex-row">
                <div class="w-fit text-xs rounded overflow-hidden">
                    <input id="import" type="file" accept=".csv" class="hidden" @change="load">
                    <label for="import">
                        <div class="px-2 py-1.5 text-white bg-gray-500">選擇檔案</div>
                    </label>
                </div>
                <div class="flex items-center gap-2 px-1.5 py-1 text-xs rounded bg-gray-500">
                    <div class="text-white">
                        項目名稱
                    </div>
                    <div class="text-xs">
                        <Input name="project_name" placeholder="請輸入項目名稱" class="py-0.5 w-28 rounded"/>
                    </div>
                </div>
                <div class="flex items-center gap-2 px-1.5 py-1 text-xs rounded bg-gray-500">
                    <div class="text-white">
                        匯入時預設狀態
                    </div>
                    <div class="text-xs">
                        <Select name="default_boarder_status_id"
                        :options="boarderStatusList" :option-key="'id'" :option-value="'name'"
                        class="py-0.5 rounded"></Select>
                    </div>
                </div>
                <div class="flex items-center text-xs">
                    <span>{{ `總筆數 ${editedData?.length}，預計匯入筆數 ${allowData?.length}` }}</span>
                </div>
            </div>
            <div class="text-sm min-h-[300px] px-2 border overflow-auto">
                <table class="w-full">
                    <tr>
                        <td class="w-14"><div class="px-2 py-1">索引</div></td>
                        <td v-for="cs in columnSchema" :class="cs?.tdClass">
                            <div class="px-2 py-1" :class="[{ 'text-red-500': cs?.require }]">{{ cs?.key }}</div>
                        </td>
                    </tr>
                    <tr v-for="it, index in editedData" :class="[{ 'bg-gray-100': index % 2 == 1 }]">
                        <td><div class="px-2 py-1">{{ index + 1 }}</div></td>
                        <td v-for="cs in columnSchema">
                            <div class="px-2 py-1"> {{ checkValueEmpty(it[cs?.key]) }}</div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="flex flex-wrap h-auto gap-2 text-sm" v-show="editedData?.length">
                <div class="flex flex-col w-full gap-2 lg:flex-row">
                    <div class="flex flex-1 flex-col p-2 border shadow">
                        <div>識別為空床位，但非必填欄位有值者</div>
                        <div>
                            <div>{{ checkValueEmpty(noticeLists?.notice1List, (v) => v?.join('、'), '無') }}</div>
                        </div>
                    </div>
                    <div class="flex flex-1 flex-col p-2 border shadow">
                        <div>學號長度不符合者</div>
                        <div>
                            <div>{{ checkValueEmpty(noticeLists?.notice2List, (v) => v?.join('、'), '無')}}</div>
                        </div>
                    </div>
                    <div class="flex flex-1 flex-col p-2 border shadow">
                        <div>電話格式不符合者</div>
                        <div>
                            <div>{{ checkValueEmpty(noticeLists?.notice3List, (v) => v?.join('、'), '無') }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full p-2 border shadow">
                    <div>預期建立的班級</div>
                    <div>
                        <div>{{ checkValueEmpty(allNewClasses, (v) => v?.join('、'), '無') }}</div>
                    </div>
                </div>
                <div class="flex flex-col w-full p-2 border shadow">
                    <div>預期建立的身份別</div>
                    <div>
                        <div>{{ checkValueEmpty(allNewBoarderRoles, (v) => v?.join('、'), '無') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <button class="shrink-0 text-sm w-full p-2 text-white bg-gray-500" :disabled="!editedData?.length" @click="onSubmit">
            匯入
        </button>
    </PopUp>
</template>

<script setup lang="ts">
    import { useForm } from 'vee-validate';
    import { parse } from 'csv-parse/browser/esm';
    import { BoarderStatusesCaller, ClassesCaller } from '~/composables/api/share';
    import { createProject, importProject } from '~/composables/api/project';
    import * as yup from 'yup';
    import _ from 'lodash';

    interface Emits {
        (e: 'onImported'): void;
    }

    const keys = readonly({
        floor: '樓',
        room_type: '區',
        room_no: '室',
        bed: '床',
        name: '姓名',
        class: '班級',
        sid: '學號',
        boarder_roles: '身分別',
        phone: '電話',
        remark: '備註',
    });
    const columnSchema = [
        { tdClass: 'w-8', key: keys.floor, require: true },
        { tdClass: 'w-8', key: keys.room_type, require: true },
        { tdClass: 'w-8', key: keys.room_no, require: true },
        { tdClass: 'w-8', key: keys.bed, require: true },
        { tdClass: '', key: keys.name, require: true },
        { tdClass: '', key: keys.class, require: false },
        { tdClass: 'w-24', key: keys.sid, require: false },
        { tdClass: 'max-w-[100px] break-all', key: keys.boarder_roles, require: false },
        { tdClass: 'w-24', key: keys.phone, require: false },
        { tdClass: 'max-w-[100px] break-all', key: keys.remark, require: false },
    ]
    const schema = yup.object().shape({
        project_name: yup.string().required(),
        default_boarder_status_id: yup.number().required(),
    });

    const emits = defineEmits<Emits>();

    const toastNotifier = inject(ToastNotifierKey);
    const { handleSubmit, setFieldValue } = useForm({ validationSchema: schema });

    const popUp = ref();
    const visible = ref(false);
    const originData = ref([]);
    const editedData = ref([]);

    const boarderStatusesCaller = new BoarderStatusesCaller();
    const { data: boarderStatusList } = boarderStatusesCaller;
    const classesCaller = new ClassesCaller();
    const { data: classList } = classesCaller;

    const noticeLists = computed(() => {
        const notice1List: any[] = [];
        const notice2List: any[] = [];
        const notice3List: any[] = [];

        editedData.value?.forEach((item, index) => {
            const isEmptyBunk = columnSchema?.filter((v) => v?.require)?.some((v) => _.isEmpty(item[v?.key]));
            const hasOptValue = columnSchema?.filter((v) => !v?.require)?.some((v) => !_.isEmpty(item[v?.key]));
            const matchSidLength = `${item[keys.sid]}`?.match(/^[a-zA-Z0-9]{10}$/)
            const matchPhone = `${item[keys.phone]}`?.match(/^09[0-9]{8}$/)
            
            if (isEmptyBunk && hasOptValue) {
                notice1List.push(index + 1);
            }
            if (!isEmptyBunk && !_.isEmpty(item[keys.sid]) && !matchSidLength) {
                notice2List.push(index + 1);
            }
            if (!isEmptyBunk && !_.isEmpty(item[keys.phone]) && !matchPhone) {
                notice3List.push(index + 1);
            }
        });

        return {
            notice1List,
            notice2List,
            notice3List,
        };
    });

    const allNewClasses = computed(() => {
        const classList = classesCaller.data.value?.map((v) => toDBC(v?.name));
        const allClassList = _.uniq(editedData.value?.map((v) => toDBC(`${v[keys.class]}`))?.filter((v) => !_.isEmpty(v)));
        return _.difference(allClassList, classList ?? []);
    });
    const allNewBoarderRoles = computed(() => {
        return _.uniq(editedData.value?.map((v) => `${v[keys?.boarder_roles]}`.split('、'))?.flat()?.filter((v) => !_.isEmpty(v)));
    });
    const allowData = computed(() => {
        const result: any[] = [];

        editedData.value?.forEach((item, index) => {
            const isEmptyBunk = columnSchema?.filter((v) => v?.require)?.some((v) => _.isEmpty(item[v?.key]));
            
            if (!isEmptyBunk) {
                result.push(item);
            }
        });

        return result;
    });
    const transformedAllowData = computed(() => {
        const result: any[] = [];

        allowData.value?.forEach((item) => {
            result.push({
                sid: item[keys.sid],
                floor: item[keys.floor],
                room_type: item[keys.room_type],
                room_no: item[keys.room_no],
                bed: item[keys.bed],
                name: item[keys.name],
                remark: item[keys.remark],
                new_boarder_roles: `${item[keys.boarder_roles]}`.split('、'),
                new_class: allNewClasses.value?.find((v) => toDBC(v) == toDBC(item[keys.class])),
                class_id: classList.value?.find((v) => toDBC(v?.name) == toDBC(item[keys.class]))?.id,
            });
        });

        return result;
    });

    onMounted(() => {
        Promise.all([
            boarderStatusesCaller?.wait(),
            classesCaller?.wait(),
        ])
        .then(() => {
            setFieldValue('default_boarder_status_id', boarderStatusList?.value?.[0]?.id);
        })
        .catch((error) => showParseError(toastNotifier, error));
    });

    const onSubmit = handleSubmit(async (data) => {
        const project_name = data?.project_name;
        const default_boarder_status_id = data?.default_boarder_status_id;
        const all_new_boarder_roles = allNewBoarderRoles.value;
        const all_new_classes = allNewClasses.value;
        const items = transformedAllowData.value;
        // create
        const response = await createProject({
            name: project_name,
        });
        // import
        await importProject({
            project_id: response?.data?.id,
            default_boarder_status_id: default_boarder_status_id,
            all_new_boarder_roles: all_new_boarder_roles,
            all_new_classes: all_new_classes,
            items: items,
        });

        toastNotifier?.success('匯入成功');
        emits('onImported');
        close();
    }, (data) => {
        toastNotifier?.error(_.map(data?.errors, (v) => v)?.[0] ?? '');
    });

    const load = (event: any) => {
        const input = event.target;

        if(!input.files[0]) return;

        const vaildFiles = Array.from(input.files).filter((it: any) => mimeTypeVaildator(it?.type, input?.accept));
        vaildFiles.slice(0, 1).forEach((element: any) => {
            originData.value = [];
            editedData.value = [];
            const reader = new FileReader();
            reader.onloadend = (event) => parseCSV(event?.target?.result as string);
            reader.readAsText(element);
        });
    };

    const mimeTypeVaildator = (checkType: string, accpetString?: string) => {
        if (!accpetString) return true;

        return accpetString.replace(/\s/g, '').split(',').filter(accept => {
            return new RegExp(accept.replace('*', '.*')).test(checkType);
        }).length > 0;
    }

    const parseCSV = (data: string) => {
        parse(data, {
            columns: true,
            skip_empty_lines: true
        }, (err, data) => {
            if (err) {
                toastNotifier?.error(err.message);
                return;
            }
            originData.value = data;
            editedData.value = _.cloneDeep(data);
        });
    }

    const show = () => {
        popUp.value?.show();
        visible.value = true;
    };

    const close = () => {
        popUp.value?.close();
        visible.value = false;
    };

    defineExpose({ show, close });
</script>