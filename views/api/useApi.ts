import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { getApis, deleteApi, addApi, updateApi } from '@/httpapis/management';
import { Api } from '@/model/managementModels';

export const useApiData = () => {
    const isLoading = ref(false);
    const data = ref<Api[]>([]);
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
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'App ID',
            dataIndex: 'app_id',
            key: 'app_id',
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
            const response = await getApis(query);
            data.value = response.data.data;
            pagination.value.total = response.data.pagination.total;
        } catch (error: any) {
            message.error(`Failed to list APIs: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const remove = async (id: number[]) => {
        isLoading.value = true;
        try {
            await deleteApi(id);
            message.success('API deleted successfully');
            return true;
        } catch (error: any) {
            message.error(`Failed to delete API: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (api: Api) => {
        isLoading.value = true;
        try {
            const response = await addApi(api);
            message.success('API created successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to create API: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const update = async (api: Api) => {
        isLoading.value = true;
        try {
            const response = await updateApi(api);
            message.success('API updated successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to update API: ${error.response?.data?.error || error.message}`);
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
