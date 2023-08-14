<template>
    <div class="flex flex-col bg-gray-500 overflow-hidden rounded text-sm">
        <div class="flex flex-1 flex-col p-3 gap-3">
            <div class="flex items-center w-full gap-1">
                <span class="shrink-0 text-white">名稱：</span>
                <div class="flex-1 text-black">
                    <Input name="name" placeholder="請輸入名稱" class="w-full rounded-sm"/>
                </div>
            </div>
            <div class="flex flex-1 items-center gap-1">
                <span class="shrink-0 text-white">備註：</span>
                <div class="h-full w-full text-black">
                    <TextArea name="remark" placeholder="請輸入備註" class="w-full rounded-sm h-full min-h-[80px] max-h-[160px]"/>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-center p-2 bg-gray-600 text-white">
            新增學期
        </div>
    </div>
</template>