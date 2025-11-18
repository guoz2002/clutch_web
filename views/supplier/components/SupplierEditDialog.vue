<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { Supplier } from '@/model/managementModels';
import { useSupplierData } from '../useSupplier';

const props = defineProps({
    visible: Boolean,
    mode: {
        type: String,
        default: 'create', // 'create' or 'edit'
    },
    supplierData: {
        type: Object as () => Supplier | null,
        default: null
    },
});

const emit = defineEmits(['update:visible', 'created', 'updated', 'cancel']);

const formRef = ref();
const formData = ref<Supplier>({} as Supplier);
const { create, update } = useSupplierData();
const isLoading = ref(false);

watch(() => props.visible, (visible) => {
    if (visible) {
        if (props.mode === 'edit' && props.supplierData) {
            formData.value = { ...props.supplierData };
        } else {
            formData.value = {
                name: '',
                sap: '',
                type: '直接供应',
            } as Supplier;
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
    <a-modal :open="visible" @cancel="handleCancel" :title="mode === 'create' ? '添加供应商' : '编辑供应商'"
        :mask-closable="false" :confirmLoading="isLoading" @ok="handleSubmit">
        <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="供应商" name="name" :rules="[{ required: true, message: '请输入供应商名称!' }]">
                <a-input v-model:value="formData.name" />
            </a-form-item>
            <a-form-item label="供应商SAP" name="sap" :rules="[{ required: true, message: '请输入供应商SAP编码!' }]">
                <a-input v-model:value="formData.sap" />
            </a-form-item>
            <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择供应商类型!' }]">
                <a-select v-model:value="formData.type">
                    <a-select-option value="直接供应">直接供应</a-select-option>
                    <a-select-option value="贸易商">贸易商</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
