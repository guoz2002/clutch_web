<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLogin } from './useLogin';
import { LoginModel } from '@/model/managementModels';

const router = useRouter();

const formRef = ref();
const formData = ref<LoginModel>({
    username: 'admin@admin.admin',
    password: 'admin',
});
const { isLoading, errorMessage, handleLogin } = useLogin();

const onSubmit = async () => {
    await handleLogin(formData.value);
    if (!errorMessage.value) {
        router.push({ name: 'Dashboard' });
    }
};
</script>

<template>
    <div class="login-container">
        <a-form ref="formRef" @submit.prevent="onSubmit" :label-col="{ style: { width: '100px' } }"
            style="width:300px;">
            <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
                <a-input v-model:value="formData.username" id="username" />
            </a-form-item>
            <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                <a-input type="password" v-model:value="formData.password" id="password" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" :loading="isLoading">登录</a-button>
            </a-form-item>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </a-form>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
