<script setup lang="ts">
import { ref } from 'vue';
import { useProductLineData } from './useProductLine';
import { ProductLine } from '@/model/managementModels';
import ProductLineDetailDialog from './components/ProductLineDetailDialog.vue';
import ProductLineEditDialog from './components/ProductLineEditDialog.vue';
import { Modal } from 'ant-design-vue';

const { columns, pagination, searchKeyword, data, isLoading, list, remove } = useProductLineData();

const selectedProductLine = ref<ProductLine | null>(null);
const isDetailDialogVisible = ref(false);

const isCreateDialogVisible = ref(false);

const showDetailDialog = (record: ProductLine) => {
    selectedProductLine.value = record;
    isDetailDialogVisible.value = true;
};

const onPageChange = () => {
    list();
};

const onSearch = () => {
    pagination.value.pageNum = 1;
    list();
};

const showCreateDialog = () => {
    isCreateDialogVisible.value = true;
};

const onCreated = () => {
    isCreateDialogVisible.value = false;
    list();
};

const handleDelete = (id: number) => {
    remove([id]).then(() => {
        list();
    });
};

const confirmDeleteProductLine = (id: number) => {
    Modal.confirm({
        title: '确定要删除这个产线吗？',
        content: '此操作无法撤销。',
        onOk: () => handleDelete(id),
    });
};


// Load data when component is mounted
list();
</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <a-input-search v-model:value="searchKeyword" placeholder="按名称搜索" style="width: 300px;"
                @search="onSearch" />
            <a-button type="primary" @click="showCreateDialog">添加产线</a-button>
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
                        <a style="color: lightcoral;" @click="confirmDeleteProductLine(record.id)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />

        <ProductLineDetailDialog :visible="isDetailDialogVisible" :productLineData="selectedProductLine"
            @update:visible="isDetailDialogVisible = $event" />
        <ProductLineEditDialog mode="create" :visible="isCreateDialogVisible"
            @update:visible="isCreateDialogVisible = $event" @created="onCreated" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
