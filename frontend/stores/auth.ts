import { defineStore } from 'pinia';
import { User } from '~/src/model';
import { UserRole } from '~/src/enum';
import axios from "axios";
import _ from 'lodash';

const ACCESS_TOKEN_KEY = 'access_token';
const PREFIX = '/api/auth';

const axiosRefreshTokenInstance = axios.create(); // 避免loop

axiosRefreshTokenInstance.interceptors.request.use((config) => {
    config.headers.Authorization = useAuthStore().getAccessToken();
    config.headers['X-CSRF-TOKEN'] = useCookie('X-CSRF-TOKEN').value;

    return config;
});

export const useAuthStore = defineStore('auth', () => {
    const authUser = ref<User | null>(null);

    const isRole = (role: UserRole) => {
        return false;
        // return authUser?.value == role;
    }

    async function login(formData: LoginFormData) {
        try {
            const response = await axios.post(`${PREFIX}/login`, formData);
            const accessToken = response.data.data.access_token;
            
            if (process.client) {
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            }
    
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    
    async function logout() {
        try {
            await axios.post(`${PREFIX}/logout`);
        }
        catch (error) {
            throw error;
        }
        finally {
            if (process.client) {
                authUser.value = null;
                localStorage.removeItem(ACCESS_TOKEN_KEY);
            }
        }
    }
    
    async function refresh() {
        try {
            const response = await axiosRefreshTokenInstance.post(`${PREFIX}/refresh`);
            const accessToken = response.data.data.access_token;

            if (process.client) {
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            }
    
            return response.data;
        }
        catch (error: any) {
            if (error?.response?.data)
                throw error.response.data;
            else
                throw error;
        }
    }
    
    async function session() {
        try {
            const response = await axios.get(`${PREFIX}/check`);
    
            const session = response.data.data;
            
            if (process.client) {
                authUser.value = session;
            }
    
            return session;
        } 
        catch (error) {
            if (process.client) {
                useAuthStore().$state.authUser = null;
            }
            return null;
        }
    }

    async function forget(formData: ForgetFormData) {
        try {
            const response = await axios.post(`${PREFIX}/forget`, formData);
    
            return response.data;
        } 
        catch (error: any) {
            if (error?.response?.data)
                throw error.response.data;
            else
                throw error;
        }
    }

    async function resetPassword(formData: ResetPasswordFormData) {
        try {
            const response = await axios.post(`${PREFIX}/resetPassword`, formData);
            const accessToken = response.data.data.access_token;
            
            if (process.client) {
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            }
    
            return response.data;
        } 
        catch (error: any) {
            if (error?.response?.data)
                throw error.response.data;
            else
                throw error;
        }
    }

    async function updatePhoto(formData: UpdatePhotoFormData) {
        try {
            const response = await axios.patch(`${PREFIX}/photo`, formData);
    
            return response.data;
        } 
        catch (error: any) {
            if (error?.response?.data)
                throw error.response.data;
            else
                throw error;
        }
    }
    
    function getAccessToken() {
        return process.client && localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    
    function clearAccessToken() {
        process.client && localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    return { 
        authUser,isRole, login, logout, 
        refresh, session, forget, resetPassword, 
        updatePhoto, getAccessToken, clearAccessToken 
    };
});

interface LoginFormData {
    email: string,
    password: string,
}

interface ForgetFormData {
    email: string,
}

interface ResetPasswordFormData {
    password: string,
    random_key: string,
}

interface UpdatePhotoFormData {
    photo: string,
}