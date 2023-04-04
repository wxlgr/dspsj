import { createRouter, createWebHashHistory } from 'vue-router'
import HomeComponent from '../components/Home.vue'

const routes = [
    {
        meta: {
            title: '首页'
        },
        path: '/',
        name: 'home',
        component: HomeComponent,
        redirect: '/welcome',
        children: [
            {
                meta: {
                    title: '欢迎页'
                },
                path: '/welcome', name: 'welcome', component: () => import('../components/Welcome.vue')
            },
            {
                meta: {
                    title: '用户管理'
                },
                path: '/users',
                name: 'users',
                component: () => import('../components/Users.vue')
            }
            ,
            {
                meta: {
                    title: '视频管理'
                },
                path: '/videos',
                name: 'videos',
                component: () => import('../components/Videos.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录页'
        },
        component: () => import('../components/Login.vue')
    },
    {
        path: '/404',
        name: 'notFound',
        meta: {
            title: '404 not found'
        },
        component: () => import('../components/NotFound.vue')
    },
    {
        path:'/:pathMatch(.*)',
        redirect:'/404'
    }
]


export default createRouter(
    {
        history: createWebHashHistory(),
        routes
    }
)