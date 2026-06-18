import { createRouter, createWebHistory } from 'vue-router'
import Analysis from '@/views/energy/Analysis.vue'
import AnalysisIndex from '@/views/energy/index.vue'

const routes = [
    {
        path: '/index',
        name: 'AnalysisIndex',
        component: AnalysisIndex
    },
    {
        path: '/analysis',
        name: 'Analysis',
        component: Analysis
    }
    // 可以添加更多路由
]

const router = createRouter({
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/sub-app-vue3' : '/'),
    routes
})

export default router
