<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { ProductModel } from '@/model/managementModels';

const props = defineProps({
    visible: Boolean,
    productModelData: Object as () => ProductModel | null,
});
const emit = defineEmits(['update:visible', 'cancel']);

const formData = ref<ProductModel>({} as ProductModel);

watch(() => props.productModelData, (newData) => {
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
    <a-modal :open="visible" @cancel="handleCancel" title="产品型号详情" :mask-closable="false" :footer="null">
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="ID">{{ formData.id }}</a-descriptions-item>
            <a-descriptions-item label="SAP">{{ formData.sap }}</a-descriptions-item>
            <a-descriptions-item label="详情">{{ formData.description }}</a-descriptions-item>
            <a-descriptions-item label="供应商">{{ formData.supplier?.name }} ({{ formData.supplier?.sap
                }})</a-descriptions-item>
        </a-descriptions>

        <div style="text-align: right; margin-top: 16px;">
            <a-button @click="handleCancel">关闭</a-button>
        </div>
    </a-modal>
</template>
