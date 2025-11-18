<script setup lang="ts">
import { onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { useCostReportData } from './useCostReport';

const {
    columns,
    pagination,
    dateRange,
    inputSupplierName,
    inputProductModelSN,
    inputMotorType,
    data,
    isLoading,
    list,
    resetFilters,
    exportToExcel
} = useCostReportData();

// 防抖函数实现自动搜索
let searchTimeout: NodeJS.Timeout | null = null;

const autoSearch = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
        pagination.value.pageNum = 1;
        list();
    }, 500); // 500ms 延迟
};

// 监听各种筛选条件变化，自动触发搜索
watch(dateRange, autoSearch, { deep: true });
watch(inputSupplierName, autoSearch);
watch(inputProductModelSN, autoSearch);
watch(inputMotorType, autoSearch);

const onPageChange = () => {
    list();
};

const onReset = () => {
    resetFilters();
    list();
};

const onExport = () => {
    exportToExcel();
};

// Load data when component is mounted
onMounted(() => {
    list();
});
</script>

<template>
    <div>
        <!-- Basic Search and Action Bar -->
        <div
            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <a-range-picker v-model:value="dateRange" format="YYYY-MM-DD" :placeholder="['开始时间', '结束时间']" />

                <a-input v-model:value="inputSupplierName" placeholder="供应商" allowClear style="width: 150px;" />

                <a-input v-model:value="inputProductModelSN" placeholder="物料编码" allowClear style="width: 150px;" />

                <a-input v-model:value="inputMotorType" placeholder="电机类型" allowClear style="width: 180px;" />
            </div>

            <div style="display: flex; gap: 8px;">
                <a-button @click="onReset">重置筛选</a-button>
                <a-button type="primary" @click="onExport" :disabled="!data || data.length === 0">
                    导出Excel
                </a-button>
            </div>
        </div>

        <a-table :columns="columns" :data-source="data" :pagination="false" :loading="isLoading" size="middle"
            :scroll="{ x: 1000 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'testDate'">
                    {{ record.testDate ? dayjs(record.testDate).format('YYYY-MM-DD') : '' }}
                </template>
                <template v-else-if="column.key === 'qualifiedCount'">
                    <a-tag color="green">{{ record.qualifiedCount || 0 }}</a-tag>
                </template>
                <template v-else-if="column.key === 'unqualifiedCount'">
                    <a-tag :color="record.unqualifiedCount > 0 ? 'red' : 'green'">{{ record.unqualifiedCount || 0
                    }}</a-tag>
                </template>
                <template v-else-if="column.key === 'totalCount'">
                    {{ record.totalCount || 0 }}
                </template>
            </template>
        </a-table>

        <a-pagination class="mt15" v-model:current="pagination.pageNum" v-model:pageSize="pagination.pageSize"
            :total="pagination.total" show-size-changer @change="onPageChange"
            style="margin-top: 16px; text-align: right;" />
    </div>
</template>

<style scoped>
.mt15 {
    margin-top: 15px;
}
</style>
