import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { getSuppliers, deleteSupplier, addSupplier, updateSupplier } from '@/httpapis/management';
import { Supplier } from '@/model/managementModels';

export const useSupplierData = () => {
    const isLoading = ref(false);
    const data = ref<Supplier[]>([]);
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
            title: '供应商',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '供应商SAP',
            dataIndex: 'sap',
            key: 'sap',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
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
            const response = await getSuppliers(query);
            data.value = response.data.data;
            pagination.value.total = response.data.pagination.total;
        } catch (error: any) {
            message.error(`Failed to list suppliers: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const remove = async (id: number[]) => {
        isLoading.value = true;
        try {
            await deleteSupplier(id);
            message.success('Supplier deleted successfully');
            return true;
        } catch (error: any) {
            message.error(`Failed to delete supplier: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (supplier: Supplier) => {
        isLoading.value = true;
        try {
            const response = await addSupplier(supplier);
            message.success('Supplier created successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to create supplier: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const update = async (supplier: Supplier) => {
        isLoading.value = true;
        try {
            const response = await updateSupplier(supplier);
            message.success('Supplier updated successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to update supplier: ${error.response?.data?.error || error.message}`);
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
        update,
    };
};
