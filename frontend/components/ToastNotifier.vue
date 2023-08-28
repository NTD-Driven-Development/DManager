<template>
    <div class="flex flex-col fixed translate-x-1/2 right-1/2 bottom-6 w-80 gap-3 z-50">
        <Transition v-for="it, index in toastList"
        enter-active-class="duration-300 max-h-16 ease-out"
        enter-from-class="transform opacity-0 max-h-0"
        leave-active-class="duration-300 ease-in"
        leave-to-class="transform opacity-0">
            <div class="flex flex-1 items-center rounded shadow py-2 px-3 gap-3 bg-white text-xs sm:text-sm" :class="{ 'cursor-pointer': it.copyable }"
             v-if="it.visible" @click="it.copyable ? copy() : ''">
                <div class="flex items-center justify-center h-8 aspect-square rounded text-white" :class="classes(it.type)">
                    <svg v-if="it.type == 'success'" class="w-1/2 h-1/2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z"/></svg>
                    <svg v-else-if="it.type == 'warning'" class="w-1/2 h-1/2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16a1 1 0 1 0 1 1a1 1 0 0 0-1-1Zm10.67 1.47l-8.05-14a3 3 0 0 0-5.24 0l-8 14A3 3 0 0 0 3.94 22h16.12a3 3 0 0 0 2.61-4.53Zm-1.73 2a1 1 0 0 1-.88.51H3.94a1 1 0 0 1-.88-.51a1 1 0 0 1 0-1l8-14a1 1 0 0 1 1.78 0l8.05 14a1 1 0 0 1 .05 1.02ZM12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z"/></svg>
                    <svg v-else-if="it.type == 'error'" class="w-1/2 h-1/2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
                    <!-- default -->
                    <svg v-else class="w-1/2 h-1/2" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
                </div>
                <div class="w-full line-clamp-2 break-all whitespace-pre-line">{{ it.message }}</div>
                <input ref="message" type="hidden" :value="it.message"/>
                <svg class="min-h-[16px] min-w-[16px] text-red-600 cursor-pointer" v-if="it.closable" @click.stop="close(it)" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { ref, Transition, nextTick } from 'vue';

    interface Options {
        timeout: number,
        closable: boolean,
        copyable: boolean,
        visible: boolean,
        date: Date,
    }

    type Type = 'success'|'warning'|'error'

    interface Item {
        message: string;
        type: Type;
        closable: boolean;
        copyable: boolean;
        visible: boolean;
        date: number;
    }

    const classes = (type: Type) => {
        if (type == 'success') {
            return 'bg-green-500';
        }
        if (type == 'warning') {
            return 'bg-orange-400';
        }
        if (type == 'error') {
            return 'bg-red-500';
        }
        return 'bg-red-500'; //default type error.
    };

    const toastList = ref<Item[]>([]);
    const message = ref();

    const copy = () => {
        const el = message.value[0];
        el.type = 'text';
        el.focus();
        el.select();
        document.execCommand('copy');
        el.type = 'hidden';
    }

    const show = async (message: string, type = 'success' as Type, options?: Partial<Options>) => {
        const timeout = options?.timeout ?? 3000;
        const closable = options?.closable ?? true;
        const copyable = options?.copyable ?? true;
        // init
        const item = { message: message, type: type, closable: closable, copyable: copyable, visible: false, date: Date.now() };
        // push
        toastList.value.push(item);
        await nextTick();
        const target = toastList.value.find((it) => it?.date == item?.date);
        if (target) target.visible = true;
        await new Promise(r => setTimeout(r, timeout));
        // remove
        const o = toastList.value.find((it) => it.date == item.date)
        if (o) o.visible = false;
        await nextTick();
        const i = toastList.value.findIndex((it) => it.date == item.date);
        if (i == undefined) return;
        toastList.value.splice(i, 1);
    }

    const success = (message: string, options?: Options) => show(message, 'success', options);
    const warning = (message: string, options?: Options) => show(message, 'warning', options);
    const error = (message: string, options?: Options) => show(message, 'error', options);

    const close = async (item: Item) => {
        const o = toastList.value.find((it) => it.date == item.date)
        if (o) o.visible = false;
        await nextTick();
        const i = toastList.value.findIndex((it) => it.date == item.date);
        if (i == undefined) return;
        toastList.value.splice(i, 1);
    }

    defineExpose({ success, warning, error });
</script>