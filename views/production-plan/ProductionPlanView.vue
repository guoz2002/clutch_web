<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductionPlanData } from './useProductionPlan';
import { ProductionPlan } from '@/model/managementModels';
import ProductionPlanDetailDialog from './components/ProductionPlanDetailDialog.vue';
import ProductionPlanEditDialog from './components/ProductionPlanEditDialog.vue';
import { Modal } from 'ant-design-vue';

const { columns, pagination, searchKeyword, data, dailyPlanCounts, list, remove, loadProductModels, loadDailyPlans } = useProductionPlanData();

const selectedProductionPlan = ref<ProductionPlan | null>(null);
const isDetailDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);
const isLoading = ref(false);

const showDetailDialog = (record: ProductionPlan) => {
    selectedProductionPlan.value = record;
    isDetailDialogVisible.value = true;
};

const showEditDialog = (record: ProductionPlan) => {
    selectedProductionPlan.value = record;
    isEditDialogVisible.value = true;
};

const showCreateDialog = () => {
    selectedProductionPlan.value = null;
    isCreateDialogVisible.value = true;
};

const handleDelete = async (id: number) => {
    isLoading.value = true;
    remove([id]).then(async () => {
        await loadDailyPlans();
        list();
    }).finally(() => {
        isLoading.value = false;
    });
};

const confirmDeleteProductionPlan = (id: number) => {
    Modal.confirm({
        title: '确定要删除这个生产计划吗？',
        content: '此操作无法撤销。',
        onOk: () => handleDelete(id),
    });
};

const onPageChange = () => {
    list();
};

const onSearch = () => {
    pagination.value.pageNum = 1;
    list();
};

const onCreated = async () => {
    isCreateDialogVisible.value = false;
    await loadDailyPlans();
    list();
};

const onUpdated = async () => {
    isEditDialogVisible.value = false;
    await loadDailyPlans();
    list();
};

onMounted(async () => {
    await loadProductModels();
    await loadDailyPlans();
    list();
});
</script>

<template>
    <div>
        <!-- 计划数量卡片 -->
        <div style="display: flex; gap: 16px; margin-bottom: 24px;">
            <a-card v-for="dayData in dailyPlanCounts" :key="dayData.dayLabel" size="small"
                style="flex: 1; text-align: center; min-width: 120px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 4px;">
                    {{ dayData.dayLabel }} ({{ dayData.displayDate }})
                </div>
                <div style="font-size: 24px; font-weight: bold; color: #1890ff;" v-if="dayData.hasPlans">
                    {{ dayData.count }}
                </div>
                <div style="font-size: 16px; color: #999;" v-else>
                    未计划
                </div>
            </a-card>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <a-input-search v-model:value="searchKeyword" placeholder="按归属或物料型号搜索" style="width: 300px;"
                @search="onSearch" />
            <a-button type="primary" @click="showCreateDialog">添加生产计划</a-button>
        </div>

        <a-table :columns="columns" :data-source="data" :pagination="false" :loading="isLoading">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'id'">
                    <a>{{ record.id }}</a>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="showDetailDialog(record)">详细信息</a>
                        <a-divider type="vertical" />
                        <a @click="showEditDialog(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a style="color: lightcoral;" @click="confirmDeleteProductionPlan(record.id)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />

        <ProductionPlanDetailDialog :visible="isDetailDialogVisible" :productionPlanData="selectedProductionPlan"
            @update:visible="isDetailDialogVisible = $event" />

        <ProductionPlanEditDialog :visible="isEditDialogVisible" mode="edit"
            :productionPlanData="selectedProductionPlan" @update:visible="isEditDialogVisible = $event"
            @updated="onUpdated" />

        <ProductionPlanEditDialog :visible="isCreateDialogVisible" mode="create"
            @update:visible="isCreateDialogVisible = $event" @created="onCreated" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
