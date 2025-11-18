<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { Supplier } from '@/model/managementModels';

const props = defineProps({
    visible: Boolean,
    supplierData: Object as () => Supplier | null,
});
const emit = defineEmits(['update:visible', 'cancel']);

const formData = ref<Supplier>({} as Supplier);

watch(() => props.supplierData, (newData) => {
    if (newData) {
        formData.value = { ...newData };
    }
}, { immediate: true });

const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" title="供应商详情" :mask-closable="false" :footer="null">
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="ID">{{ formData.id }}</a-descriptions-item>
            <a-descriptions-item label="供应商">{{ formData.name }}</a-descriptions-item>
            <a-descriptions-item label="供应商SAP">{{ formData.sap }}</a-descriptions-item>
            <a-descriptions-item label="类型">{{ formData.type }}</a-descriptions-item>
        </a-descriptions>

        <div style="text-align: right; margin-top: 16px;">
            <a-button @click="handleCancel">关闭</a-button>
        </div>
    </a-modal>
</template>
