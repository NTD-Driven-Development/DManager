<template>
    <div ref="contaier" class="flex flex-col w-full h-fit shadow-md border" @mousedown.stop="isContentVisable = !isContentVisable">
        <div ref="summary" class="w-full p-3 sm:p-5" @mousedown.stop @mouseup.stop="isContentVisable = !isContentVisable">
            <slot name="summary" :isVisable="isVisable"/>
        </div>
        <div ref="content" class="overflow-hidden transition-all ease-in-out duration-500 max-h-0 hidden"
        @mousedown.stop>
            <slot name="content"/>
        </div>
    </div>
</template>

<script setup lang="ts">
    const isContentVisable = ref(false);
    const isVisable = ref(false);
    const contaier = ref();
    const summary = ref();
    const content = ref();
    
    watch(() => isContentVisable.value, () => {
        if (isContentVisable.value) {
            content.value.classList.remove('hidden');
            setTimeout(() => {
                isVisable.value = true;
                content.value.classList.remove('opacity-0');
                content.value.style['max-height'] = `${content.value.scrollHeight + 40}px`;
                content.value.classList.add('p-3', 'pt-0', 'sm:p-5', 'sm:pt-0');
                content.value.classList.remove('max-h-0');
            }, 1);
        }
        else {
            isVisable.value = false;
            content.value.classList.add('opacity-0');
            content.value.style['max-height'] = '0px';
            content.value.classList.remove('p-3', 'pt-0', 'sm:p-5', 'sm:pt-0');
            content.value.classList.add('max-h-0');
            setTimeout(() => {
                if (isVisable.value) return;
                content.value.classList.add('hidden');
            }, 500);
        }
    });
</script>