<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { Api } from '@/model/managementModels';
import { useApiData } from '../useApi';

const props = defineProps({
    visible: Boolean,
    mode: {
        type: String,
        default: 'create', // 'create' or 'edit'
    },
    apiData: {
        type: Object as () => Api | null,
        default: null
    },
});

const emit = defineEmits(['update:visible', 'created', 'updated', 'cancel']);

const formRef = ref();
const formData = ref<Api>({} as Api);
const { create, update } = useApiData();
const isLoading = ref(false);
const showSecret = ref(props.mode === 'create');

watch(() => props.visible, (visible) => {
    if (visible) {
        if (props.mode === 'edit' && props.apiData) {
            formData.value = { ...props.apiData, secret: '' };
            showSecret.value = false;
        } else {
            formData.value = {
                name: '',
                appId: '',
                secret: '',
            } as Api;
            showSecret.value = true;
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

        const promise = props.mode === 'create'
            ? create(formData.value)
            : update(formData.value);

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
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" :title="mode === 'create' ? '添加API' : '编辑 API'"
        :mask-closable="false" :confirmLoading="isLoading" @ok="handleSubmit">
        <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入API名称!' }]">
                <a-input v-model:value="formData.name" />
            </a-form-item>

            <a-form-item label="App ID" name="appId" :rules="[{ required: true, message: '请输入App ID!' }]">
                <a-input v-model:value="formData.appId" />
            </a-form-item>

            <a-form-item v-if="showSecret" label="密钥" name="secret"
                :rules="[{ required: mode === 'create', message: '请输入密钥!' }]">
                <a-input-password v-model:value="formData.secret" />
            </a-form-item>

        </a-form>
    </a-modal>
</template>
