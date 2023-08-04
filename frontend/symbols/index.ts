import { InjectionKey } from 'vue';
import _ToastNotifier from '~/components/ToastNotifier.vue'

export const ToastNotifierKey: InjectionKey<InstanceType<typeof _ToastNotifier>> = Symbol();