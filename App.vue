<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import router from "./router/router";
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const selectedKeys = ref<string[]>(["Dashboard"]);
const openKeys = ref<string[]>(["operation", "product", "user"]);

const onSiderClick = ({ key }: { key: string }) => {
  router.push({ name: key });
};

const route = useRoute();
const breadcrumbItems = computed(() => {
  const matched = route.matched;
  return matched.map((m) => m.name);
});

const showSidebar = computed(() => {
  return route.name !== "Login";
});

watch(route, () => {
  selectedKeys.value = [route.name as string];
});
</script>

<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider width="200" style="background: #fff" v-if="showSidebar">
        <!-- 系统标题 -->
        <div class="system-header">
          <div class="system-logo">
            <img src="@/assets/logo.png" alt="Logo" class="logo-icon" />
          </div>
          <div class="system-title">
            <div class="system-name">海信VMI系统</div>
            <div class="system-subtitle">Hisense VMI</div>
          </div>
        </div>

        <!-- Sidebar menu -->
        <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline"
          :style="{ height: '100%', borderRight: 0 }" @click="onSiderClick">

          <!-- 仪表板 -->
          <a-menu-item key="Dashboard">
            <span>仪表板</span>
          </a-menu-item>

          <!-- 数据查询 -->
          <a-sub-menu key="query">
            <template #title>
              <span>数据追溯</span>
            </template>
            <a-menu-item key="Pallet">托盘</a-menu-item>
            <a-menu-item key="Product">电机</a-menu-item>
            <a-menu-item key="DefectReport">缺陷报告</a-menu-item>
            <a-menu-item key="InspectionReport">全检报表</a-menu-item>
            <a-menu-item key="CostReport">费用报表</a-menu-item>
          </a-sub-menu>

          <!-- 产品管理 -->
          <a-sub-menu key="product">
            <template #title>
              <span>信息维护</span>
            </template>
            <a-menu-item key="Supplier">供应商</a-menu-item>
            <a-menu-item key="ProductModel">物料管理</a-menu-item>
            <a-menu-item key="ProductionPlan">生产计划</a-menu-item>
            <a-menu-item key="ProductLine">产线</a-menu-item>
          </a-sub-menu>

          <!-- 报表导出 -->
          <!-- <a-sub-menu key="report">
            <template #title>
              <span>报表导出</span>
            </template>
            <a-menu-item key="Supplier">供应商</a-menu-item>
            <a-menu-item key="ProductModel">产品型号</a-menu-item>
            <a-menu-item key="ProductionPlan">生产计划</a-menu-item>
            <a-menu-item key="ProductLine">产线</a-menu-item>
          </a-sub-menu> -->

          <!-- 用户与权限 -->
          <a-sub-menu key="user">
            <template #title>
              <span>用户与权限</span>
            </template>
            <a-menu-item key="User">用户管理</a-menu-item>
            <a-menu-item key="API">API</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item">{{ item }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <a-config-provider :locale="zhCN">
            <RouterView />
          </a-config-provider>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout {
  width: 100vw;
  min-height: 100vh;
}

/* 系统标题样式 */
.system-header {
  display: flex;
  align-items: center;
  padding: 16px 16px 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
}

.system-logo {
  margin-right: 12px;
}

.logo-icon {
  display: inline-block;
  background: linear-gradient(135deg, #ffffff, #e4e4e4);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  width: 48px;
  height: 48px;
  padding: 4px;
}

.system-title {
  flex: 1;
}

.system-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
  margin-bottom: 2px;
}

.system-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 400;
  letter-spacing: 0.5px;
}
</style>
