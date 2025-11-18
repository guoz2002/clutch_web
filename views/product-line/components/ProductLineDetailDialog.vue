<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { ProductLine } from '@/model/managementModels';

const props = defineProps({
    visible: Boolean,
    productLineData: Object as () => ProductLine | null,
});
const emit = defineEmits(['update:visible', 'cancel']);

const formData = ref<ProductLine>({} as ProductLine);

watch(() => props.productLineData, (newData) => {
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
    <a-modal :open="visible" @cancel="handleCancel" title="产线详情" :mask-closable="false" :footer="null">
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="ID">{{ formData.id }}</a-descriptions-item>
            <a-descriptions-item label="产线名称">{{ formData.name }}</a-descriptions-item>
            <a-descriptions-item label="托盘 SN 前缀">{{ formData.palletSnPrefix }}</a-descriptions-item>
            <a-descriptions-item label="设备 ID">{{ formData.deviceId }}</a-descriptions-item>
        </a-descriptions>

        <div style="text-align: right; margin-top: 16px;">
            <a-button @click="handleCancel">关闭</a-button>
        </div>
    </a-modal>
</template>
