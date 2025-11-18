<template>
    <div class="custom-card" :class="{ 'dark-mode': isDarkMode }">
        <div class="custom-card-header" v-if="title">
            <div class="custom-card-title">{{ title }}</div>
        </div>
        <div class="custom-card-body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string
    isDarkMode?: boolean
}

defineProps<Props>()
</script>

<style scoped>
.custom-card {
    background: #ffffff;
    border-radius: 12px;
    border: 2px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
    position: relative;
}

.custom-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1890ff, #722ed1, #fa8c16);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.custom-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.custom-card:hover::before {
    opacity: 1;
}

.custom-card-header {
    padding: 8px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
    position: relative;
}

.custom-card-title {
    font-size: 22px;
    font-weight: 600;
    color: #262626;
    margin: 0;
    line-height: 1.2;
    position: relative;
}

.custom-card-body {
    padding: 20px;
    height: calc(100% - 60px);
    background: #ffffff;
}

/* 深色模式样式 */
.custom-card.dark-mode {
    background: #0c1f35cc;
    border-color: #12689d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.custom-card.dark-mode::before {
    background: linear-gradient(90deg, #00d0ff, #08f1c3, #a3f1ff);
}

.custom-card.dark-mode:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.custom-card.dark-mode .custom-card-header {
    background: #0c1f35cc;
    border-bottom-color: #12689d;
}

.custom-card.dark-mode .custom-card-title {
    color: #0efcff;
    text-shadow: 0 0 10px rgba(14, 252, 255, 0.2);
}

.custom-card.dark-mode .custom-card-body {
    background: #0c1f35cc;
    color: #ffffff;
}

/* 科技感光效 */
@keyframes glow {

    0%,
    100% {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    50% {
        box-shadow: 0 2px 8px rgba(0, 208, 255, 0.3);
    }
}

.custom-card.dark-mode:hover {
    animation: glow 2s infinite;
}
</style>
