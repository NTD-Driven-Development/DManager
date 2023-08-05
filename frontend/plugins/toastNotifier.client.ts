import { createApp } from 'vue';
import ToastNotifier from '~/components/ToastNotifier.vue';
import { ToastNotifierKey } from '~/src/symbols';

export default defineNuxtPlugin((nuxtApp): any => {
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);
    const toast = createApp(ToastNotifier).mount(mountPoint) as InstanceType<typeof ToastNotifier>;
    nuxtApp.vueApp.provide(ToastNotifierKey, toast);
})