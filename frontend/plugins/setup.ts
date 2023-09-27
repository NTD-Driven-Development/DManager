import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { config } from 'process';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
    axios.interceptors.request.use((config) => {
        config.baseURL = window.location.origin;
        config.headers.Authorization = useAuthStore().getAccessToken();
        config.headers['X-CSRF-TOKEN'] = useCookie('X-CSRF-TOKEN').value;

        return config;
    });

    axios.interceptors.response.use((response) => response, async (error: AxiosError) => {
        const authStore = useAuthStore();
        const { transformResponse, ...originConfig } = error.config!;

        try {
            if (error.response && error.response.status == 401) {
                await authStore.refresh(); // 嘗試刷新token

                const config: AxiosRequestConfig = {
                    ...originConfig,
                };

                const response = await axios(config);
                return response;
            }
            else {
                return error;
            }
        }
        catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.status == 401) {
                    authStore.clearAccessToken();
                }

                return error;
            }
            return error;
        }
    });
})