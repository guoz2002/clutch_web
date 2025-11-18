import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import Layout from '@/App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from '@/router/router';

// Configure dayjs with required plugins for Ant Design Vue
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/zh-cn';

// 先扩展插件
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.locale('zh-cn'); // 设置为中文


const pinia = createPinia();

createApp(Layout)
    .use(router)
    .use(pinia)
    .use(Antd)
    .mount('#app');
