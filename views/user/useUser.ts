import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { getUsers, deleteUser, addUser, updateUser } from '@/httpapis/management';
import { User } from '@/model/managementModels';
import dayjs from 'dayjs';

export const useUserData = () => {
    const isLoading = ref(false);
    const data = ref<User[]>([]);
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
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '状态',
            dataIndex: 'active',
            key: 'active',
            customRender: ({ text }: { text: boolean }) => text ? 'Yes' : 'No',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            customRender: ({ text }: { text: string }) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
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
            const response = await getUsers(query);
            data.value = response.data.data;
            pagination.value.total = response.data.pagination.total;
        } catch (error: any) {
            message.error(`Failed to list users: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const remove = async (id: number[]) => {
        isLoading.value = true;
        try {
            await deleteUser(id);
            message.success('User deleted successfully');
            return true;
        } catch (error: any) {
            message.error(`Failed to delete user: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (user: User) => {
        isLoading.value = true;
        try {
            const response = await addUser(user);
            message.success('User created successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to create user: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const update = async (user: User) => {
        isLoading.value = true;
        try {
            const response = await updateUser(user);
            message.success('User updated successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to update user: ${error.response?.data?.error || error.message}`);
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
