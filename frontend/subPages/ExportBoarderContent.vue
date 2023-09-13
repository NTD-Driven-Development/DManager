<template>
    <div class="flex flex-col">
        <Tabs :keys="keyList" :initKey="'pointLogs'">
            <template #pointLogs>
                <div class="w-full overflow-auto">
                    <OrderTable id="id" :headers="pointLogheaders" :rows="exportItem?.point_logs">
                        <template #編號="{ data }">
                            <div class="px-2 py-1">
                                {{ checkValueEmpty(data?.point_rule?.code) }}
                            </div>
                        </template>
                        <template #事由="{ data }">
                            <div class="flex justify-center min-w-[200px]">
                                <div class="whitespace-pre-wrap break-all">
                                    {{ checkValueEmpty(data?.point_rule, (v) => `${v?.code}.${v?.reason}`) }}
                                </div>
                            </div>
                        </template>
                        <template #點數="{ data }">{{ checkValueEmpty(data?.point) }}</template>
                        <template #備註="{ data }">
                            <div class="flex justify-center min-w-[200px]">
                                <div class="whitespace-pre-wrap break-all">
                                    {{ checkValueEmpty(data?.remark) }}
                                </div>
                            </div>
                        </template>
                        <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                        <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                    </OrderTable>
                </div>
            </template>
            <template #telCardLogs>
                <div class="w-full overflow-auto">
                    <OrderTable id="id" :headers="telCardHeaders" :rows="exportItem?.tel_card_logs">
                        <template #聯絡對象="{ data }">
                            <div class="px-2 py-1">
                                {{ checkValueEmpty(data?.tel_card_contacter?.name) }}
                            </div>
                        </template>
                        <template #備註="{ data }">
                            <div class="whitespace-pre-wrap break-all">
                                {{ checkValueEmpty(data?.remark) }}
                            </div>
                        </template>
                        <template #聯絡時間="{ data }">{{ checkValueEmpty(data?.contacted_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                        <template #建立時間="{ data }">{{ checkValueEmpty(data?.created_at, (v) => format(new Date(v), 'yyyy-MM-dd')) }}</template>
                        <template #建立者="{ data }">{{ checkValueEmpty(data?.creator?.name) }}</template>
                    </OrderTable>
                </div>
            </template>
        </Tabs>
    </div>
</template>

<script setup lang="ts">
    import { ExportItem } from '~/composables/api/export';
    import { format } from 'date-fns';

    interface Props {
        exportItem: ExportItem,
    }

    const props = defineProps<Props>();

    const keyList = {
        pointLogs : { title: '加扣點' },
        telCardLogs : { title: '電話卡' },
    }

    const pointLogheaders = [
        { title: '編號', values: ['point_rule'] },
        { title: '事由', values: ['point_rule'] },
        { title: '點數', values: ['point'] },
        { title: '備註', values: ['remark'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
    ]

    const telCardHeaders = [
        { title: '聯絡對象', values: ['tel_card_contacter'] },
        { title: '備註', values: ['remark'] },
        { title: '聯絡時間', values: ['contacted_at'] },
        { title: '建立時間', values: ['created_at'] },
        { title: '建立者', values: ['creator'] },
    ]
</script>