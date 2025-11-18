import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { getProductLines, addProductLine, deleteProductLine } from '@/httpapis/management';
import { ProductLine } from '@/model/managementModels';

export const useProductLineData = () => {
    const isLoading = ref(false);
    const data = ref<ProductLine[]>([]);
    const pagination = ref({
        pageNum: 1,
        pageSize: 10,
        total: 0,
    });
    const searchKeyword = ref('');

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 40,
        },
        {
            title: '产线名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '设备 ID',
            dataIndex: 'deviceId',
            key: 'deviceId',
        },
        {
            title: '托盘 SN 前缀',
            dataIndex: 'palletSnPrefix',
            key: 'palletSnPrefix',
        },
        {
            title: '是否注册',
            dataIndex: 'isRegistered',
            key: 'isRegistered',
        },
        {
            title: '操作',
            key: 'action',
        },
    ];

    const list = async () => {
        isLoading.value = true;
        const query = {
            pageNum: pagination.value.pageNum,
            pageSize: pagination.value.pageSize,
            keyword: searchKeyword.value,
        };
        try {
            const response = await getProductLines(query);
            data.value = response.data.data;
            pagination.value.total = response.data.pagination.total;
        } catch (error: any) {
            message.error(`Failed to list product lines: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const remove = async (id: number[]) => {
        isLoading.value = true;
        try {
            await deleteProductLine(id);
            message.success('Product line deleted successfully');
            return true;
        } catch (error: any) {
            message.error(`Failed to delete product line: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (productLine: ProductLine) => {
        isLoading.value = true;
        try {
            const response = await addProductLine(productLine);
            message.success('Product line created successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to create product line: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        data,
        columns,
        pagination,
        searchKeyword,
        list,
        remove,
        create,
    };
};
