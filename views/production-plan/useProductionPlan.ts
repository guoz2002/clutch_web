import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import {
    getProductionPlans,
    deleteProductionPlan,
    addProductionPlan,
    updateProductionPlan,
    getProductModels,
    getProductionPlansByDateRange
} from '@/httpapis/management';
import { ProductionPlan, ProductModel } from '@/model/managementModels';
import dayjs from 'dayjs';

export const useProductionPlanData = () => {
    const isLoading = ref(false);
    const data = ref<ProductionPlan[]>([]);
    const productModels = ref<ProductModel[]>([]);
    const dailyPlansData = ref<any>({});
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
            title: '日期',
            dataIndex: 'startAt',
            key: 'startAt',
            customRender: ({ text }: { text: string }) => text ? dayjs(text).format('YYYY-MM-DD') : '',
        },
        {
            title: '归属',
            dataIndex: 'belongsTo',
            key: 'belongsTo',
        },
        {
            title: '产品型号',
            dataIndex: ['productModel', 'description'],
            key: 'productModel',
        },
        {
            title: '计划',
            dataIndex: 'planned',
            key: 'planned',
        },
        {
            title: '实际',
            dataIndex: 'actual',
            key: 'actual',
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
            const response = await getProductionPlans(query);
            data.value = response.data.data;
            pagination.value.total = response.data.pagination.total;
        } catch (error: any) {
            message.error(`Failed to list production plans: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const loadProductModels = async () => {
        try {
            const response = await getProductModels({ pageSize: 100 });
            productModels.value = response.data.data;
        } catch (error: any) {
            message.error(`Failed to load product models: ${error.response?.data?.error || error.message}`);
        }
    };

    const loadDailyPlans = async () => {
        try {
            const today = dayjs().format('YYYY-MM-DD');
            const response = await getProductionPlansByDateRange(today);
            dailyPlansData.value = response.data.data;
        } catch (error: any) {
            message.error(`Failed to load daily plans: ${error.response?.data?.error || error.message}`);
        }
    };

    const remove = async (id: number[]) => {
        isLoading.value = true;
        try {
            await deleteProductionPlan(id);
            message.success('Production plan deleted successfully');
            return true;
        } catch (error: any) {
            message.error(`Failed to delete production plan: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const create = async (productionPlan: ProductionPlan) => {
        isLoading.value = true;
        try {
            const response = await addProductionPlan(productionPlan);
            message.success('Production plan created successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to create production plan: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    const update = async (productionPlan: ProductionPlan) => {
        isLoading.value = true;
        try {
            const response = await updateProductionPlan(productionPlan);
            message.success('Production plan updated successfully');
            return response;
        } catch (error: any) {
            message.error(`Failed to update production plan: ${error.response?.data?.error || error.message}`);
            return Promise.reject(error);
        } finally {
            isLoading.value = false;
        }
    };

    // 计算T、T+1、T+2、T+3的计划数量
    const dailyPlanCounts = computed(() => {
        const today = dayjs();
        const counts = [];

        for (let i = 0; i < 4; i++) {
            const targetDate = today.add(i, 'day');
            const dayLabel = i === 0 ? 'T' : `T+${i}`;
            const displayDate = targetDate.format('MM-DD');

            // 从API返回的数据中获取对应日期的计划
            const dayPlans = dailyPlansData.value[dayLabel] || [];
            const planCount = dayPlans.reduce((sum: number, plan: ProductionPlan) => sum + plan.planned, 0);

            counts.push({
                date: targetDate.format('YYYY-MM-DD'),
                dayLabel,
                displayDate,
                count: planCount,
                hasPlans: planCount > 0
            });
        }

        return counts;
    });

    return {
        isLoading,
        data,
        productModels,
        columns,
        pagination,
        searchKeyword,
        dailyPlanCounts,
        list,
        loadProductModels,
        loadDailyPlans,
        remove,
        create,
        update,
    };
};
