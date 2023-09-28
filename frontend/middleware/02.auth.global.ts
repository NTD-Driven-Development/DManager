import { pathToRegexp } from 'path-to-regexp';
import { useAuthStore } from '~/stores/auth';

const LOGIN_PATH = '/login';
const REDIRECT_PATH = '/boarders';

// 驗證是否已登入
export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const { authUser } = storeToRefs(authStore);
    const regexp = pathToRegexp(exceptRouteList);

    if (process.server) return;

    // 如果前往的路由不需登入 則直接導向預期畫面
    if (exceptRouteList?.length && regexp.test(to.path)) {
        return;
    }

    // 如果未登入 則直接導向登入頁
    if (!authUser.value) {
        let query = {} as any;

        if (from.path != LOGIN_PATH)
            query.target = from.path;
        else if (to.path != LOGIN_PATH)
            query.target = to.path;
        
        if (to.path == LOGIN_PATH) {
            return;
        }
        else {
            return navigateTo({
                path: LOGIN_PATH,
                query,
            });
        }
    }

    // 已驗證身分的狀況下 嘗試前往登入頁 則直接導向控制台
    if (to?.query?.target) return navigateTo(to?.query?.target as string);
    if (to.path == LOGIN_PATH) return REDIRECT_PATH;
    
    // 導向預期畫面
    return;
})

const exceptRouteList: string[] = [
    // '/',
    // '/example/(.*)',
    '/forget',
]