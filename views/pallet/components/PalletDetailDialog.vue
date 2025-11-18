<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { Pallet } from '@/model/managementModels';
import { usePalletDetail } from '../usePallet';

const props = defineProps({
    visible: Boolean,
    palletData: Object as () => Pallet | null,
});
const emit = defineEmits(['update:visible', 'cancel']);

const formData = ref<Pallet>({} as Pallet);

// 使用 usePallet 中的数据管理功能
const {
    products,
    isLoadingProducts,
    productColumns,
    loadProducts,
    resetProducts,
    formatDateTime
} = usePalletDetail();

watch(() => props.visible, (visible) => {
    if (!visible) {
        resetProducts();
    } else if (props.palletData?.id) {
        loadProducts(props.palletData.id);
    }
});

const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" title="托盘详情" :mask-closable="false" :footer="null" width="800px">
        <!-- 基本信息 -->
        <a-descriptions title="基本信息" bordered :column="1">
            <a-descriptions-item label="ID">{{ formData.id }}</a-descriptions-item>
            <a-descriptions-item label="托盘SN">{{ formData.sn }}</a-descriptions-item>
            <a-descriptions-item label="产品型号">{{ formData.productModel?.description }} ({{
                formData.productModel?.sap }})</a-descriptions-item>
            <a-descriptions-item label="生产商信息">{{ formData.productModel?.supplier?.name }} ({{
                formData.productModel?.supplier?.sap }})</a-descriptions-item>
            <a-descriptions-item label="产品线">{{ formData.productLine?.name }}</a-descriptions-item>
            <a-descriptions-item label="目标数量">{{ formData.goal }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ formatDateTime(formData.createdAt) }}</a-descriptions-item>
        </a-descriptions>

        <!-- 电机列表 -->
        <div style="margin-top: 24px;">
            <h3>电机列表</h3>
            <a-table :columns="productColumns" :data-source="products" :pagination="false" :loading="isLoadingProducts"
                size="small" :scroll="{ y: 300 }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'id'">
                        <a>{{ record.id }}</a>
                    </template>
                </template>
            </a-table>
            <div style="margin-top: 8px; color: #666; font-size: 12px;">
                共 {{ products.length }} 台电机
            </div>
        </div>

        <div style="text-align: right; margin-top: 16px;">
            <a-button @click="handleCancel">关闭</a-button>
        </div>
    </a-modal>
</template>
