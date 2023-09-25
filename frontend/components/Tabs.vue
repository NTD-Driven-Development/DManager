<template>
    <div>
        <div class="flex items-end w-fit">
            <button v-for="it, key in keys" class="relative px-4 py-2 h-fit border bg-white"
            :class="[selected == key ? 'border-b-transparent z-10 font-semibold rounded-t' : 'text-xs']"
            @click="selected = (key as K)">
                {{ (it as R)?.title }}
            </button>
        </div>
        <div class="relative -top-px flex flex-col w-full px-4 py-4 border rounded-r rounded-bl bg-white">
            <div v-for="it, key in keys" v-show="selected == key">
                <slot :name="key"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="R extends Record<string, KeyItem>, K extends keyof R">
    export interface KeyItem {
        title: string,
    }

    interface Props {
        keys: R,
        initKey?: K,
    }

    const props = defineProps<Props>();

    const selected = ref(props?.initKey) as Ref<K>;
</script>