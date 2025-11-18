<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { User } from '@/model/managementModels';
import { useUserData } from '../useUser';

const props = defineProps({
    visible: Boolean,
    mode: {
        type: String,
        default: 'create', // 'create' or 'edit'
    },
    userData: {
        type: Object as () => User | null,
        default: null
    },
});

const emit = defineEmits(['update:visible', 'created', 'updated', 'cancel']);

const formRef = ref();
const formData = ref<User>({} as User);
const { create, update } = useUserData();
const isLoading = ref(false);
const showPassword = ref(props.mode === 'create');
const resetPassword = ref(false);

watch(() => props.visible, (visible) => {
    if (visible) {
        if (props.mode === 'edit' && props.userData) {
            formData.value = { ...props.userData, password: '' };
            showPassword.value = false;
            resetPassword.value = false;
        } else {
            formData.value = {
                username: '',
                email: '',
                mobile: '',
                password: '',
                active: true,
            } as User;
            showPassword.value = true;
        }
    }
}, { immediate: true });

const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};

const handleSubmit = () => {
    formRef.value.validate().then(() => {
        isLoading.value = true;

        const userData = { ...formData.value };

        // If not resetting password in edit mode, remove the password field
        if (props.mode === 'edit' && !resetPassword.value) {
            delete userData.password;
        }

        const promise = props.mode === 'create'
            ? create(userData)
            : update(userData);

        promise
            .then((response) => {
                if (props.mode === 'create') {
                    emit('created', response);
                } else {
                    emit('updated', response);
                }
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};

const toggleResetPassword = () => {
    resetPassword.value = !resetPassword.value;
    if (!resetPassword.value) {
        formData.value.password = '';
    }
};
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" :title="mode === 'create' ? 'Add User' : '编辑 User'"
        :mask-closable="false" :confirmLoading="isLoading" @ok="handleSubmit">
        <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="Username" name="username"
                :rules="[{ required: true, message: 'Please input username!' }]">
                <a-input v-model:value="formData.username" />
            </a-form-item>

            <a-form-item label="Email" name="email" :rules="[
                { required: true, message: 'Please input email!' },
                { type: 'email', message: 'Please input a valid email!' }
            ]">
                <a-input v-model:value="formData.email" />
            </a-form-item>

            <a-form-item label="Mobile" name="mobile"
                :rules="[{ required: true, message: 'Please input mobile number!' }]">
                <a-input v-model:value="formData.mobile" />
            </a-form-item>

            <template v-if="mode === 'edit'">
                <a-form-item label="Reset Password">
                    <a-switch v-model:checked="resetPassword" @change="toggleResetPassword" />
                </a-form-item>
            </template>

            <a-form-item v-if="showPassword || resetPassword" label="Password" name="password"
                :rules="[{ required: showPassword || resetPassword, message: 'Please input password!' }]">
                <a-input-password v-model:value="formData.password" />
            </a-form-item>

            <a-form-item label="Active" name="active">
                <a-switch v-model:checked="formData.active" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
