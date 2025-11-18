<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from 'vue';
import { Api } from '@/model/managementModels';

const props = defineProps({
    visible: Boolean,
    apiData: Object as () => Api | null,
});
const emit = defineEmits(['update:visible', 'cancel']);

const formData = ref<Api>({} as Api);

watch(() => props.apiData, (newData) => {
    if (newData) {
        formData.value = { ...newData };
    }
}, { immediate: true });

const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
};
</script>

<template>
    <a-modal :open="visible" @cancel="handleCancel" title="API Details" :mask-closable="false" :footer="null">
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="ID">{{ formData.id }}</a-descriptions-item>
            <a-descriptions-item label="Name">{{ formData.name }}</a-descriptions-item>
            <a-descriptions-item label="App ID">{{ formData.appId }}</a-descriptions-item>
        </a-descriptions>

        <div style="text-align: right; margin-top: 16px;">
            <a-button @click="handleCancel">Close</a-button>
        </div>
    </a-modal>
</template>
