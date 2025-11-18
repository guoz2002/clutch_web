<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { User } from '@/model/managementModels';
import dayjs from 'dayjs';

const props = defineProps({
    visible: Boolean,
    userData: Object as () => User | null,
});
const emit = defineEmits(['update:visible', 'cancel']);

const formData = ref<User>({} as User);

watch(() => props.userData, (newData) => {
    if (newData) {
        formData.value = { ...newData };
    }
}, { immediate: true });

const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};

const formatDateTime = (date: string) => {
    return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '';
};
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" title="User Details" :mask-closable="false" :footer="null">
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="ID">{{ formData.id }}</a-descriptions-item>
            <a-descriptions-item label="Username">{{ formData.username }}</a-descriptions-item>
            <a-descriptions-item label="Email">{{ formData.email }}</a-descriptions-item>
            <a-descriptions-item label="Mobile">{{ formData.mobile }}</a-descriptions-item>
            <a-descriptions-item label="Active">{{ formData.active ? 'Yes' : 'No' }}</a-descriptions-item>
            <a-descriptions-item label="Created At">{{ formatDateTime(formData.createdAt!) }}</a-descriptions-item>
            <a-descriptions-item label="Updated At">{{ formatDateTime(formData.updatedAt!) }}</a-descriptions-item>
        </a-descriptions>

        <div style="text-align: right; margin-top: 16px;">
            <a-button @click="handleCancel">Close</a-button>
        </div>
    </a-modal>
</template>
