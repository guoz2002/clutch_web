import ApiView from '@/views/api/ApiView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import CostReportView from '@/views/cost-report/CostReportView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import DefectReportView from '@/views/defect-report/DefectReportView.vue'
import InspectionReportView from '@/views/inspection-report/InspectionReportView.vue'
import PalletView from '@/views/pallet/PalletView.vue'
import ProductView from '@/views/product/ProductView.vue'
import ProductLineView from '@/views/product-line/ProductLineView.vue'
import ProductModelView from '@/views/product-model/ProductModelView.vue'
import ProductionPlanView from '@/views/production-plan/ProductionPlanView.vue'
import SupplierView from '@/views/supplier/SupplierView.vue'
import UserView from '@/views/user/UserView.vue'


const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        name: 'Product',
        path: '/product',
        component: ProductView,
        meta: { requiresAuth: true }
    },
    {
        name: 'DefectReport',
        path: '/defect-report',
        component: DefectReportView,
        meta: { requiresAuth: true }
    },
    {
        name: 'InspectionReport',
        path: '/inspection-report',
        component: InspectionReportView,
        meta: { requiresAuth: true }
    },
    {
        name: 'CostReport',
        path: '/cost-report',
        component: CostReportView,
        meta: { requiresAuth: true }
    },
    {
        name: 'ProductLine',
        path: '/product-line',
        component: ProductLineView,
        meta: { requiresAuth: true }
    },
    {
        name: 'ProductModel',
        path: '/product-model',
        component: ProductModelView,
        meta: { requiresAuth: true }
    },
    {
        name: 'ProductionPlan',
        path: '/production-plan',
        component: ProductionPlanView,
        meta: { requiresAuth: true }
    },
    {
        name: 'Pallet',
        path: '/pallet',
        component: PalletView,
        meta: { requiresAuth: true }
    },
    {
        name: 'Supplier',
        path: '/supplier',
        component: SupplierView,
        meta: { requiresAuth: true }
    },
    {
        name: 'User',
        path: '/user',
        component: UserView,
        meta: { requiresAuth: true }
    },
    {
        name: 'API',
        path: '/api',
        component: ApiView,
        meta: { requiresAuth: true }
    },
    {
        name: 'Login',
        path: '/login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
]

export default routes