<script setup lang="ts">
import { ref } from 'vue';
import { useSupplierData } from './useSupplier';
import { Supplier } from '@/model/managementModels';
import SupplierDetailDialog from './components/SupplierDetailDialog.vue';
import SupplierEditDialog from './components/SupplierEditDialog.vue';
import { Modal } from 'ant-design-vue';

const { columns, pagination, searchKeyword, data, isLoading, list, remove } = useSupplierData();

const selectedSupplier = ref<Supplier | null>(null);
const isDetailDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);

const showDetailDialog = (record: Supplier) => {
    selectedSupplier.value = record;
    isDetailDialogVisible.value = true;
};

const showEditDialog = (record: Supplier) => {
    selectedSupplier.value = record;
    isEditDialogVisible.value = true;
};

const showCreateDialog = () => {
    selectedSupplier.value = null;
    isCreateDialogVisible.value = true;
};

const handleDelete = (id: number) => {
    remove([id]).then(() => {
        list();
    });
};

const confirmDeleteSupplier = (id: number) => {
    Modal.confirm({
        title: 'Are you sure you want to delete this supplier?',
        content: 'This action cannot be undone.',
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

const onCreated = () => {
    isCreateDialogVisible.value = false;
    list();
};

const onUpdated = () => {
    isEditDialogVisible.value = false;
    list();
};

// Load data when component is mounted
list();
</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <a-input-search v-model:value="searchKeyword" placeholder="按名称或SAP搜索" style="width: 300px;"
                @search="onSearch" />
            <a-button type="primary" @click="showCreateDialog">添加供应商</a-button>
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
                        <a style="color: lightcoral;" @click="confirmDeleteSupplier(record.id)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />

        <SupplierDetailDialog :visible="isDetailDialogVisible" :supplierData="selectedSupplier"
            @update:visible="isDetailDialogVisible = $event" />

        <SupplierEditDialog :visible="isEditDialogVisible" mode="edit" :supplierData="selectedSupplier"
            @update:visible="isEditDialogVisible = $event" @updated="onUpdated" />

        <SupplierEditDialog :visible="isCreateDialogVisible" mode="create"
            @update:visible="isCreateDialogVisible = $event" @created="onCreated" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
