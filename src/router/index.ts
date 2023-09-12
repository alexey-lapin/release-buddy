import {createRouter, createWebHistory} from 'vue-router'
import DependencyGraphView from '@/views/DependencyGraphView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/dependency-graph'
        },
        {
            path: '/dependency-graph',
            name: 'dependency graph',
            component: DependencyGraphView
        }
    ]
})

export default router
