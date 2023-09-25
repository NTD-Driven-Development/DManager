<template>
    <div class="flex justify-center p-4 font-GenJyuuGothic min-h-full sm:p-8 xl:p-12 bg-gray-50">
        <div class="grid grid-cols-12 gap-3 h-fit w-full max-w-4xl">
            <!-- 個人資訊 -->
            <ProfileEditableContent></ProfileEditableContent>
            <!-- 其他操作 -->
            <button class="col-span-6 flex items-center justify-center p-3 text-sm text-white bg-gray-600 rounded md:col-span-4"
            @click="profilePasswordUpdatePopUp.show()"
            >變更密碼</button>
        </div>
        <ProfilePasswordUpdatePopUp ref="profilePasswordUpdatePopUp"></ProfilePasswordUpdatePopUp>
    </div>
</template>

<script setup lang="ts">
     const profilePasswordUpdatePopUp = ref();
</script>