import { pathToRegexp } from 'path-to-regexp';
import { useAuthStore } from '~/stores/auth';

// 如有cookie 則嘗試登入user
export default defineNuxtRouteMiddleware(async (to, from) => {    
    const authStore = useAuthStore();
    const regexp = pathToRegexp(exceptRouteList);

    if (process.server) return;

    if (exceptRouteList?.length && regexp.test(to.path)) {
        return;
    }

    if (authStore.getAccessToken() && (to.fullPath == from.fullPath || to.path != from.path)) {
        await authStore.session(); // cache session to state.
    }
})

const exceptRouteList: string[] = [
]