import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
    axios.interceptors.request.use((config) => {
        config.baseURL = window.location.origin;
        config.headers.Authorization = useAuthStore().getAccessToken();
        config.headers['X-CSRF-TOKEN'] = useCookie('X-CSRF-TOKEN').value;

        return config;
    });

    axios.interceptors.response.use((response) => response, async (error) => {
        return new Promise(async (resolve, reject) => {
            const authStore = useAuthStore();
            const config = error.config;

            try {
                if (error.response && error.response.status == 401) {
                    await authStore.refresh(); // 嘗試刷新token

                    config.headers.Authorization = authStore.getAccessToken();
                    config.responseType = 'json';

                    const response = await axios.request(config);
                    response.data = JSON.parse(response?.data);
                    
                    resolve(response);
                }
                else {
                    return reject(error);
                }
            }
            catch (refreshError) {
                authStore.clearAccessToken();
                
                return reject(refreshError);
            }
        });
    });
})