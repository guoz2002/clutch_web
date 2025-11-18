<script setup lang="ts">
import { ref, defineProps, watch, defineEmits, onMounted } from 'vue';
import { ProductModel } from '@/model/managementModels';
import { useProductModelData } from '../useProductModel';

const props = defineProps({
    visible: Boolean,
    mode: {
        type: String,
        default: 'create', // 'create' or 'edit'
    },
    productModelData: {
        type: Object as () => ProductModel | null,
        default: null
    },
});

const emit = defineEmits(['update:visible', 'created', 'updated', 'cancel']);

const formRef = ref();
const formData = ref<ProductModel>({} as ProductModel);
const { create, update, suppliers, loadSuppliers } = useProductModelData();
const isLoading = ref(false);

onMounted(async () => {
    await loadSuppliers();
});

watch(() => props.visible, (visible) => {
    if (visible) {
        if (props.mode === 'edit' && props.productModelData) {
            formData.value = { ...props.productModelData };
        } else {
            formData.value = {
                sap: '',
                description: '',
                supplierId: undefined,
            } as ProductModel;
        }
    }
}, { immediate: true });

const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};

const handleSubmit = () => {
    formRef.value.validate().then(() => {
        isLoading.value = true;

        const promise = props.mode === 'create'
            ? create(formData.value)
            : update(formData.value);

        promise
            .then((response) => {
                if (props.mode === 'create') {
                    emit('created', response);
                } else {
                    emit('updated', response);
                }
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" :title="mode === 'create' ? '添加产品型号' : '编辑产品型号'"
        :mask-closable="false" :confirmLoading="isLoading" @ok="handleSubmit">
        <a-form ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="SAP" name="sap" :rules="[{ required: true, message: '请输入SAP编码!' }]">
                <a-input v-model:value="formData.sap" />
            </a-form-item>

            <a-form-item label="详情" name="description"
                :rules="[{ required: true, message: 'Please input description!' }]">
                <a-input v-model:value="formData.description" />
            </a-form-item>

            <a-form-item label="供应商" name="supplierId"
                :rules="[{ required: true, message: 'Please select a supplier!' }]">
                <a-select v-model:value="formData.supplierId" show-search option-filter-prop="label">
                    <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id"
                        :label="`${supplier.name} (${supplier.sap})`">
                        {{ supplier.name }} ({{ supplier.sap }})
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
