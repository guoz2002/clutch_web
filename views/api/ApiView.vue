<script setup lang="ts">
import { ref } from 'vue';
import { useApiData } from './useApi';
import { Api } from '@/model/managementModels';
import ApiDetailDialog from './components/ApiDetailDialog.vue';
import ApiEditDialog from './components/ApiEditDialog.vue';
import { Modal } from 'ant-design-vue';

const { columns, pagination, searchKeyword, data, isLoading, list, remove } = useApiData();

const selectedApi = ref<Api | null>(null);
const isDetailDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);

const showDetailDialog = (record: Api) => {
    selectedApi.value = record;
    isDetailDialogVisible.value = true;
};

const showEditDialog = (record: Api) => {
    selectedApi.value = record;
    isEditDialogVisible.value = true;
};

const showCreateDialog = () => {
    selectedApi.value = null;
    isCreateDialogVisible.value = true;
};

const handleDelete = (id: number) => {
    remove([id]).then(() => {
        list();
    });
};

const confirmDeleteApi = (id: number) => {
    Modal.confirm({
        title: 'Are you sure you want to delete this API?',
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
            <a-input-search v-model:value="searchKeyword" placeholder="按名称或App ID搜索" style="width: 300px;"
                @search="onSearch" />
            <a-button type="primary" @click="showCreateDialog">添加API</a-button>
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
                        <a style="color: lightcoral;" @click="confirmDeleteApi(record.id)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />

        <ApiDetailDialog :visible="isDetailDialogVisible" :apiData="selectedApi"
            @update:visible="isDetailDialogVisible = $event" />

        <ApiEditDialog :visible="isEditDialogVisible" mode="edit" :apiData="selectedApi"
            @update:visible="isEditDialogVisible = $event" @updated="onUpdated" />

        <ApiEditDialog :visible="isCreateDialogVisible" mode="create" @update:visible="isCreateDialogVisible = $event"
            @created="onCreated" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
