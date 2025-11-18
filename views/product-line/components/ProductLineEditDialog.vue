<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { ProductLine } from '@/model/managementModels';
import { useProductLineData } from '../useProductLine';

const props = defineProps({
    visible: Boolean,
    mode: {
        type: String,
        default: 'create', // 'create' or 'edit'
    },
    productLineData: {
        type: Object as () => ProductLine | null,
        default: null
    },
});

const emit = defineEmits(['update:visible', 'created', 'updated', 'cancel']);

const formRef = ref();
const formData = ref<ProductLine>({} as ProductLine);
const { create } = useProductLineData();
const isLoading = ref(false);

watch(() => props.visible, (visible) => {
    if (visible) {
        if (props.mode === 'edit' && props.productLineData) {
            formData.value = { ...props.productLineData };
        } else {
            formData.value = {
                deviceId: '',
            } as ProductLine;
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
            : Promise.resolve(); // TODO: Add update functionality when backend supports it

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
    <a-modal :open="visible" @cancel="handleCancel" :title="mode === 'create' ? '添加产线' : '编辑产线'" :mask-closable="false"
        :confirmLoading="isLoading" @ok="handleSubmit">
        <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="设备 ID" name="deviceId" :rules="[{ required: true, message: '请输入设备 ID!' }]">
                <a-input v-model:value="formData.deviceId" placeholder="e.g., DEVICE-LINE-001" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
