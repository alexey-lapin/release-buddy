import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import DependencyGraphView from '@/views/DependencyGraphView.vue'
import DependencyInfoView from '@/views/DependencyInfoView.vue'

const router = createRouter({
    history: import.meta.env.VITE_APP_HISTORY === "hash"
        ? createWebHashHistory(import.meta.env.BASE_URL)
        : createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/dependency-build-graph'
        },
        {
            path: '/dependency-build-graph',
            name: 'dependency build graph',
            component: DependencyGraphView
        },
        {
            path: '/dependency-info',
            name: 'dependency info',
            component: DependencyInfoView
        }
    ]
})

export default router
