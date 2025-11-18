<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductModelData } from './useProductModel';
import { ProductModel } from '@/model/managementModels';
import ProductModelDetailDialog from './components/ProductModelDetailDialog.vue';
import ProductModelEditDialog from './components/ProductModelEditDialog.vue';
import { Modal } from 'ant-design-vue';

const { columns, pagination, searchKeyword, data, list, remove, loadSuppliers } = useProductModelData();

const selectedProductModel = ref<ProductModel | null>(null);
const isDetailDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);
const isLoading = ref(false);

const showDetailDialog = (record: ProductModel) => {
    selectedProductModel.value = record;
    isDetailDialogVisible.value = true;
};

const showEditDialog = (record: ProductModel) => {
    selectedProductModel.value = record;
    isEditDialogVisible.value = true;
};

const showCreateDialog = () => {
    selectedProductModel.value = null;
    isCreateDialogVisible.value = true;
};

const handleDelete = (id: number) => {
    isLoading.value = true;
    remove([id]).then(() => {
        list();
    }).finally(() => {
        isLoading.value = false;
    });
};

const confirmDeleteProductModel = (id: number) => {
    Modal.confirm({
        title: '确定要删除这个物料型号吗？',
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

const onCreated = () => {
    isCreateDialogVisible.value = false;
    list();
};

const onUpdated = () => {
    isEditDialogVisible.value = false;
    list();
};

onMounted(async () => {
    await loadSuppliers();
    list();
});
</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <a-input-search v-model:value="searchKeyword" placeholder="按SAP或描述搜索" style="width: 300px;"
                @search="onSearch" />
            <a-button type="primary" @click="showCreateDialog">添加物料型号</a-button>
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
                        <a style="color: lightcoral;" @click="confirmDeleteProductModel(record.id)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />

        <ProductModelDetailDialog :visible="isDetailDialogVisible" :productModelData="selectedProductModel"
            @update:visible="isDetailDialogVisible = $event" />

        <ProductModelEditDialog :visible="isEditDialogVisible" mode="edit" :productModelData="selectedProductModel"
            @update:visible="isEditDialogVisible = $event" @updated="onUpdated" />

        <ProductModelEditDialog :visible="isCreateDialogVisible" mode="create"
            @update:visible="isCreateDialogVisible = $event" @created="onCreated" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
