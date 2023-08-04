import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
    axios.interceptors.request.use((config) => {
        config.baseURL = window.location.href;
        config.headers.Authorization = useAuthStore().getAccessToken();
        config.headers['X-CSRF-TOKEN'] = useCookie('X-CSRF-TOKEN').value;

        return config;
    });

    axios.interceptors.response.use((response) => response, async (error) => {
        const authStore = useAuthStore();
        
        try {
            if (error.response && error.response.status == 401) {
                await authStore.refresh(); // 嘗試刷新token
                const config = error.config;

                config.headers.Authorization = authStore.getAccessToken();

                return axios(config);
            }
            else {
                return Promise.reject(error);
            }
        }
        catch (refreshError) {
            authStore.clearAccessToken();
            
            return Promise.reject(refreshError);
        }
    });
})