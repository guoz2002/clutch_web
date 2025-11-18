<script setup lang="ts">
import { ref } from 'vue';
import { useUserData } from './useUser';
import { User } from '@/model/managementModels';
import UserDetailDialog from './components/UserDetailDialog.vue';
import UserEditDialog from './components/UserEditDialog.vue';
import { Modal } from 'ant-design-vue';

const { columns, pagination, searchKeyword, data, isLoading, list, remove } = useUserData();

const selectedUser = ref<User | null>(null);
const isDetailDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const isCreateDialogVisible = ref(false);

const showDetailDialog = (record: User) => {
    selectedUser.value = record;
    isDetailDialogVisible.value = true;
};

const showEditDialog = (record: User) => {
    selectedUser.value = record;
    isEditDialogVisible.value = true;
};

const showCreateDialog = () => {
    selectedUser.value = null;
    isCreateDialogVisible.value = true;
};

const handleDelete = (id: number) => {
    remove([id]).then(() => {
        list();
    });
};

const confirmDeleteUser = (id: number) => {
    Modal.confirm({
        title: '确定要删除这个用户吗？',
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

// Load data when component is mounted
list();
</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <a-input-search v-model:value="searchKeyword" placeholder="按用户名、邮箱或手机号搜索" style="width: 300px;"
                @search="onSearch" />
            <a-button type="primary" @click="showCreateDialog">添加用户</a-button>
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
                        <a style="color: lightcoral;" @click="confirmDeleteUser(record.id)">删除</a>
                    </span>
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />

        <UserDetailDialog :visible="isDetailDialogVisible" :userData="selectedUser"
            @update:visible="isDetailDialogVisible = $event" />

        <UserEditDialog :visible="isEditDialogVisible" mode="edit" :userData="selectedUser"
            @update:visible="isEditDialogVisible = $event" @updated="onUpdated" />

        <UserEditDialog :visible="isCreateDialogVisible" mode="create" @update:visible="isCreateDialogVisible = $event"
            @created="onCreated" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
