import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { login } from '@/httpapis/management';
import { LoginModel } from '@/model/managementModels';
import { useAuthStore } from '@/pinia/useAuthStore';

export const useLogin = () => {
    const isLoading = ref(false);
    const errorMessage = ref('');
    const authStore = useAuthStore();

    const handleLogin = async (formData: LoginModel) => {
        isLoading.value = true;
        errorMessage.value = '';
        try {
            const res = await login(formData);
            message.success('Login successful');

            // save token and username to store
            authStore.setToken(res.data.token);
            authStore.setUsername(formData.username);
        } catch (error: any) {
            errorMessage.value = `Login failed. Please check your credentials and try again. ${error.response?.data?.error || error.message}`;
            message.error(errorMessage.value);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        errorMessage,
        handleLogin,
    };
};
