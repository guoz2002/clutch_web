import { ref } from 'vue';
import { message } from 'ant-design-vue';
import {
    getProductModels,
    deleteProductModel,
    addProductModel,
    updateProductModel,
    getSuppliers
} from '@/httpapis/management';
import { ProductModel, Supplier } from '@/model/managementModels';

export const useProductModelData = () => {
    const isLoading = ref(false);
    const data = ref<ProductModel[]>([]);
    const suppliers = ref<Supplier[]>([]);
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
            title: 'SAP',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            title: '详情',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '供应商',
            dataIndex: ['supplier', 'name'],
            key: 'supplier',
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
            const response = await getProductModels(query);
            data.value = response.data.data;
            pagination.value.total = response.data.pagination.total;
        } catch (error: any) {
            message.error(`Failed to list product models: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const loadSuppliers = async () => {
        try {
            const response = await getSuppliers({ pageSize: 100 });
            suppliers.value = response.data.data;
        } catch (error: any) {
            message.error(`Failed to load suppliers: ${error.response?.data?.error || error.message}`);
        }
    };

    const remove = async (id: number[]) => {
        isLoading.value = true;
        try {
            await deleteProductModel(id);
            message.success('Product model deleted successfully');
            return true;
        } catch (error: any) {
            message.error(`Failed to delete product model: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (productModel: ProductModel) => {
        isLoading.value = true;
        try {
            const response = await addProductModel(productModel);
            message.success('Product model created successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to create product model: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const update = async (productModel: ProductModel) => {
        isLoading.value = true;
        try {
            const response = await updateProductModel(productModel);
            message.success('Product model updated successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to update product model: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        data,
        suppliers,
        columns,
        pagination,
        searchKeyword,
        list,
        loadSuppliers,
        remove,
        create,
        update,
    };
};
