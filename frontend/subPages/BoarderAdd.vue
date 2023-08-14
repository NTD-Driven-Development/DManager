<template>
    <div class="flex flex-col bg-gray-500 overflow-hidden rounded text-sm">
        <div class="flex flex-1 flex-col p-3 gap-1">
            <div class="flex justify-center w-full gap-2">
                <div class="flex flex-1 flex-col gap-0.5">
                    <span class="shrink-0 text-white">學號：</span>
                    <div class="flex-1 text-black text-xs">
                        <Input name="name" placeholder="請輸入學號" class="w-full rounded"/>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-0.5">
                    <span class="shrink-0 text-white">名稱：</span>
                    <div class="flex-1 text-black text-xs">
                        <Input name="name" placeholder="請輸入名稱" class="w-full rounded"/>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center w-full gap-0.5">
                <span class="shrink-0 text-white">備註：</span>
                <div class="h-full w-full text-black text-xs">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded h-full min-h-[80px] max-h-[160px]"/>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-center p-2 bg-gray-600 text-white">
            新增住宿生
        </div>
    </div>
</template>